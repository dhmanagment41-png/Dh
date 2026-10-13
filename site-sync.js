window.siteSync = (() => {
    const client = window.supabase.createClient(window.DH_SUPABASE_URL, window.DH_SUPABASE_ANON_KEY);
    const contentTable = 'site_content';
    const contentId = 'main';
    const imageBucket = 'site-images';
    let saveTimer;

    function setStatus(message) {
        const status = document.getElementById('saveStatus');
        if (status) status.textContent = message;
    }

    function parseStoredValue(value) {
        try {
            return JSON.parse(value);
        } catch {
            return value;
        }
    }

    function getLocalContent() {
        const content = {};
        for (let index = 0; index < localStorage.length; index += 1) {
            const key = localStorage.key(index);
            if (key && !key.startsWith('sb-')) content[key] = parseStoredValue(localStorage.getItem(key));
        }
        return content;
    }

    function setLocalContent(content) {
        for (let index = localStorage.length - 1; index >= 0; index -= 1) {
            const key = localStorage.key(index);
            if (key && !key.startsWith('sb-')) localStorage.removeItem(key);
        }
        Object.entries(content || {}).forEach(([key, value]) => {
            localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
        });
    }

    async function uploadImage(file) {
        if (!file || !file.type.startsWith('image/')) throw new Error('اختار ملف صورة صالح.');
        if (file.size > 10 * 1024 * 1024) throw new Error('حجم الصورة لازم يكون أقل من 10 ميجابايت.');
        const extension = file.type.split('/')[1].replace('jpeg', 'jpg').replace(/[^a-z0-9]/gi, '') || 'img';
        const path = `${crypto.randomUUID()}.${extension}`;
        const { error } = await client.storage.from(imageBucket).upload(path, file, {
            contentType: file.type,
            cacheControl: '3600'
        });
        if (error) throw error;
        return client.storage.from(imageBucket).getPublicUrl(path).data.publicUrl;
    }

    async function replaceInlineImages(value) {
        if (typeof value === 'string' && /^data:image\//i.test(value)) {
            const blob = await fetch(value).then((response) => response.blob());
            return uploadImage(new File([blob], 'migrated-image', { type: blob.type || 'image/png' }));
        }
        if (Array.isArray(value)) return Promise.all(value.map(replaceInlineImages));
        if (value && typeof value === 'object') {
            const entries = await Promise.all(Object.entries(value).map(async ([key, nested]) => [key, await replaceInlineImages(nested)]));
            return Object.fromEntries(entries);
        }
        return value;
    }

    async function load() {
        const { data, error } = await client
            .from(contentTable)
            .select('content')
            .eq('id', contentId)
            .maybeSingle();
        if (error) throw error;
        if (!data) return false;
        setLocalContent(data.content);
        return true;
    }

    async function saveNow() {
        const content = await replaceInlineImages(getLocalContent());
        setLocalContent(content);
        const { error } = await client.from(contentTable).upsert({
            id: contentId,
            content,
            updated_at: new Date().toISOString()
        });
        if (error) throw error;
        return true;
    }

    function queueSave() {
        clearTimeout(saveTimer);
        setStatus('جارٍ مزامنة التعديلات...');
        saveTimer = setTimeout(() => {
            saveNow()
                .then(() => setStatus('تم حفظ التعديلات ومزامنتها.'))
                .catch((error) => {
                    console.error('Supabase save failed:', error);
                    setStatus(`تعذرت المزامنة: ${error.message}`);
                });
        }, 700);
    }

    async function signIn(email, password) {
        const { data, error } = await client.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data.session;
    }

    async function getSession() {
        const { data, error } = await client.auth.getSession();
        if (error) throw error;
        return data.session;
    }

    async function signOut() {
        const { error } = await client.auth.signOut();
        if (error) throw error;
    }

    async function clearContent() {
        clearTimeout(saveTimer);
        const { error } = await client.from(contentTable).upsert({
            id: contentId,
            content: {},
            updated_at: new Date().toISOString()
        });
        if (error) throw error;
        for (let index = localStorage.length - 1; index >= 0; index -= 1) {
            const key = localStorage.key(index);
            if (key && !key.startsWith('sb-')) localStorage.removeItem(key);
        }
    }

    return { load, saveNow, queueSave, uploadImage, signIn, getSession, signOut, clearContent };
})();
