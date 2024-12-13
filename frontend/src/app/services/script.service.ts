import { Injectable } from "@angular/core";
import { ScriptStore } from "../external/script.store";

@Injectable({
    providedIn: "root",
})
export class ScriptService {
    private scripts: any = {};

    constructor() {
        ScriptStore.forEach((script: any) => {
            this.scripts[script.name] = {
                loaded: false,
                src: script.src,
            };
        });
    }

    load(...scripts: string[]) {
        let promises: any[] = [];
        scripts.forEach((script) => {
            promises.push(this.loadScript(script));
        });
        return Promise.all(promises);
    }

    loadScript(name: string) {
        return new Promise((resolve, reject) => {
            //resolve if already loaded

            if (this.scripts[name].loaded) {
                resolve({
                    script: this.scripts.name,
                    loaded: true,
                    status: "Already loaded.",
                });
            } else {
                // load script
                let script = document.createElement("script");
                script.type = "text/javascript";
                script.src = this.scripts[name].src;

                script.onload = () => {
                    this.scripts[name].loaded = true;
                    resolve({
                        script: name,
                        loaded: true,
                        status: "Loaded.",
                    });
                };
                script.onerror = (error: any) => {
                    resolve({
                        script: name,
                        loaded: false,
                        status: "Loaded.",
                    });
                };
                document.getElementsByTagName("head")[0].appendChild(script);
            }
        });
    }
}
