export default class RoleServices {
    URL_API: string = `${import.meta.env.VITE_DB_HOST}/rol`;

    headers() {
        const token = localStorage.getItem("token");
        let tokenFormat = "";

        if (token && token != "undefined") {
            tokenFormat = JSON.parse(token);
        } else {
            localStorage.removeItem("token");
        }
        
        return {
            'x-access-token': `${tokenFormat}`
        }
    }

    getRolById(id: string) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(`${this.URL_API}/${id}`);
                const json = await response.json();
                resolve(json);
            } catch (error) {
                reject(error);
            }
        });
    }
}