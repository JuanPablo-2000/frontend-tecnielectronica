export default class InventarioServices {
    URL_API: string = `${import.meta.env.VITE_DB_HOST}/inventario`;

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

    getAllInventario() {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(`${this.URL_API}`, {
                    headers: this.headers()
                });

                if(response.ok) {
                    const json = await response.json();
                    resolve(json);
                } else {
                    const json = await response.json();
                    reject(json);
                }
            } catch (error) {
                reject(error)
            }
        })
    }

    getInventarioPagination(limit: number, skip: number) {
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
                reject(error)
            }
        })
    }

    getSearchForInventario(filtro: any, skip?: number, limit?: number) {
        return new Promise(async (resolve, reject) => {
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

    createInventario(body: any) {
        return new Promise(async (resolve, reject) => {
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
        })
    }

    updateInventario(body: any, id: string) {
        return new Promise(async (resolve, reject) => {
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
        })
    }

    deleteInventario(id: string) {
        return new Promise(async (resolve, reject) => {
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
        })
    }

}