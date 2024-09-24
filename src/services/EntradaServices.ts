export default class EntradaServices {
    URL_API: string = `${import.meta.env.VITE_DB_HOST}/entradas`;

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

    getEntradaPaginations(limit: number, skip: number) {
        return new Promise(async(resolve, reject) => {
            try {
                const response = await fetch(`${this.URL_API}/pagination?skip=${skip}&limit=${limit}`, {
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

    getSearchForEntrada(filtro: any, skip?: number, limit?: number) {
        return new Promise(async(resolve, reject) => {
            try {
                const response = await fetch(`${this.URL_API}/${filtro}?skip=${skip}&limit=${limit}`, {
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
        })
    }

    getSearchConsultaInventario(filtro: any, skip?: number, limit?: number) {
        return new Promise(async(resolve, reject) => {
            try {
                const response = await fetch(`http://localhost:4000/inventario/${filtro}?skip=${skip}&limit=${limit}`, {
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
        })
    }

    createEntrada(body: any) {
        return new Promise(async(resolve, reject) => {
            try {
                const response = await fetch(`${this.URL_API}/`, {
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

    updateEntrada(body: any, id: any) {
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

    deleteEntrada(id: string) {
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