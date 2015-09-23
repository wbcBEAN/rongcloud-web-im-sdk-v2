module RongIMLib {
    export class PollingTransportation implements Transportation {
        url: string;
        polling: any;
        allowWithCrendentials: boolean;
        isXHR: boolean = true;
        empty: Function = new Function;
        method: string = "GET";
        supportArrayBuffer: boolean = typeof window['Int8Array'] === "function";
        //连接状态 true:已连接 false:未连接
        connected: boolean = false;
        //是否关闭： true:已关闭 false：未关闭
        isClose: boolean = false;
        queue: Array<any> = [];
        //构造函数传入参数
        constructor(url: string) {
            this.url = "http://" + url;
        }
        //创建通道
        createTransport(): any {
            var request = this.createHtppRequest();
            this.polling = request;
            this.polling.open(this.method, this.url);
            this.addEvent();
            return this.polling;
        }
        //传送消息流
        send(data: any): any {
            if (this.isClose) {
                throw new Error("The Connection is closed,Please open the Connection!!!");
            }
            if (!this.connected && !this.isClose) {
                this.queue.push(data);
            }
            this.polling.send(data);
        }
        //接收服务器返回消息
        onData(data?: any): string {
            //TODO 转换数据，触发事件，告知client，将数据回显
            var respnseText = this.polling.responseText
            return undefined;
        }
        //处理通道关闭操作
        onClose(): any {
            this.polling = this.empty;
        }
        //通道异常操作
        onError(error: any): void {
            throw new Error(error);
        }
        //绑定事件
        addEvent(): void {
            var self = this;
            if (self.isXHR) {
                self.polling.onreadystatechange = function() {
                    if (4 != self.polling.readyState) return;
                    //204为错误状态码，在IE原生的XHR会被转换成200，而在IE的ActiveX版本中会被转换为1223,所以此处判断200 和 1223
                    if (200 == self.polling.status || 1223 == self.polling.status) {
                        self.onData();
                    } else {
                        setTimeout(function() {
                            self.onError(self.polling.status);
                        }, 0);
                    }
                }
            } else {
                self.polling.onload = function() {
                    self.onData();
                };
                self.polling.onerror = function() {
                    self.onError(self.polling.responseText);
                };
            }
        }
        /***
        *返回XMLHttpRequest或者XdomainRequest
        *设置参数 isXHR、allowWithCrendentials
        */
        createHtppRequest(): any {
            var hasCORS = typeof XMLHttpRequest !== 'undefined' && 'withCredentials' in new XMLHttpRequest(), self = this;
            if ('undefined' != typeof XMLHttpRequest && hasCORS) {
                self.allowWithCrendentials = true;
                //isXHR 此处无需设置，默认true
                return new XMLHttpRequest();
            } else if ('undefined' != typeof XDomainRequest) {
                self.isXHR = false;
                return new XDomainRequest();
            } else {
                return new Function;
            }
        }
        checkWithCredentials(): boolean {
            if (!('XMLHttpRequest' in window)) return false;
            var xmlRequest = new XMLHttpRequest();
            return xmlRequest.withCredentials !== undefined;
        }
        doQueue():void{
            var self = this;
            for (let i = 0,len = self.queue.length; i < len; i++) {
                self.send(self.queue[i]);
            }
        }
        disconnect(): void {

        }
        reconnect(): void {

        }
    }
}
