export default class TiendaAudioService {
    URL_API: string = `${import.meta.env.VITE_DB_HOST}/outStore`;

    headers() {
        const token = localStorage.getItem("token");
        let tokenFormat = "";

        if (token && token != "undefined") {
            tokenFormat = token;
        } else {
            localStorage.removeItem("token");
        }
        
        return {
            'x-access-token': `${tokenFormat}`,
            "Content-type": "application/json"
        }
    }

    getTiendaAudioPaginations(limit: number, skip: number) {
        return new Promise(async(resolve, reject) => {
            try {
                const response = await fetch(`${this.URL_API}/pagination?skip=${skip}&limit=${limit}`, {
                    method: 'GET',
                    headers: this.headers()
                });

                if (response.ok) {
                    const json = await response.json();
                    resolve(json);
                } else {
                    const json = await response.json();
                    reject(json);
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    getSearchForTiendaAudio(filter: any, skip?: number, limit?: number) {
        return new Promise(async(resolve, reject) => {
            try {
                const response = await fetch(`${this.URL_API}/${filter}?${skip}&limit${limit}`, {
                    method: 'GET',
                    headers: this.headers()
                });

                if (response.ok) {
                    const json = await response.json();
                    resolve(json);
                } else {
                    const json = await response.json();
                    reject(json);
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    createTiendaAudio(body: any) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(`${this.URL_API}`, {
                    method: 'POST',
                    body: JSON.stringify(body),
                    headers: this.headers()
                });

                if (response.ok) {
                    const json = await response.json();
                    resolve(json);
                } else {
                    const json = await response.json();
                    reject(json);
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    updateTiendaAudio(body: any, id: any) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(`${this.URL_API}/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify(body),
                    headers: this.headers()
                });

                if (response.ok) {
                    const json = await response.json();
                    resolve(json);
                } else {
                    const json = await response.json();
                    reject(json);
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    deleteTiendaAudio(id: string) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(`${this.URL_API}/${id}`, {
                    method: 'DELETE',
                    headers: this.headers()
                });

                if (response.ok) {
                    const json = await response.json();
                    resolve(json);
                } else {
                    const json = await response.json();
                    reject(json);
                }
            } catch (error) {
                reject(error);
            }
        });
    }
}