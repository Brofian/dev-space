class LocaleStorageAdapter {

    public get<R>(key: string): R|undefined {
        const dataJson = window.localStorage.getItem(key);
        if(!dataJson) {
            return undefined;
        }

        try {
            return JSON.parse(dataJson) as R;
        }
        catch (err) {
            console.error(err)
            return undefined;
        }
    }

    public set(key: string, data: any): void {
        window.localStorage.setItem(key, JSON.stringify(data));
    }


}

const localeStorage = new LocaleStorageAdapter();
export default localeStorage;