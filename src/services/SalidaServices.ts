export default class SalidaServices {
    URL_API: string = `${import.meta.env.VITE_DB_HOST}/salida`;

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
            'Content-Type': 'application/json'
        }
    }

    getSalidaPaginations(limit: number, skip: number) {
        return new Promise(async(resolve, reject) => {
            try {
                const response = await fetch(
                    `${this.URL_API}/pagination?skip=${skip}&limit=${limit}`, {
                    headers: this.headers()
                });
    
                if(response.ok) {
                    const json = await response.json();
                    resolve(json);
                }else {
                    const json = await response.json();
                    reject(json);
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    getSearchForSalida(filtro: any) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(`${this.URL_API}/${filtro}`, {
                    method: 'GET',
                    headers: this.headers()
                });
                
                if(response.ok) {
                    const json = await response.json();
                    resolve(json);
                }else {
                    const json = await response.json();
                    reject(json);
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    getSearchConsultaInventario(filtro: any, skip?: number, limit?: number) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(`${this.URL_API}/inventario/${filtro}?skip=${skip}&limit=${limit}`, {
                    method: 'GET',
                    headers: this.headers()
                });
                
                if(response.ok) {
                    const json = await response.json();
                    resolve(json);
                }else {
                    const json = await response.json();
                    reject(json);
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    createSalida(body: any) {
        return new Promise(async(resolve, reject) => {
            try {
                const response = await fetch(`${this.URL_API}`, {
                    method: 'POST',
                    body: JSON.stringify(body),
                    headers: this.headers()
                });

                if(response.ok) {
                    const json = await response.json();
                    resolve(json);
                }else {
                    const json = await response.json();
                    reject(json);
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    updateSalida(body: any, id: string) {
        return new Promise(async(resolve, reject) => {
            try {
                const response = await fetch(`${this.URL_API}/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify(body),
                    headers: this.headers()
                });

                if(response.ok) {
                    const json = await response.json();
                    resolve(json);
                }else {
                    const json = await response.json();
                    reject(json);
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    deleteSalida(id: string) {
        return new Promise(async(resolve, reject) => {
            try {
                const response = await fetch(`${this.URL_API}/${id}`, {
                    method: 'DELETE',
                    headers: this.headers()
                });

                if(response.ok) {
                    const json = await response.json();
                    resolve(json);
                }else {
                    const json = await response.json();
                    reject(json);
                }
            } catch (error) {
                reject(error);
            }
        });
    }


}