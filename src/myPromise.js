class MyPromise{

    constructor(executor){

        let resolve = (value) => {
            this.state = 'resolved';
            this.value = value;
            notifySubscribers();
        };

        let reject = (value) =>{
            this.state = 'rejected';
            this.value = value;
            notifySubscribers();
        };

        this.state = 'pending';

        try {
            executor(resolve, reject);
        }catch (e) {
            reject(e);
        }

    }

    notifySubscribers(){

        for(let subscriber of this.chain){
            if(this.state === 'resolved'){
                subscriber.onResolve(this.value);
            }
            else{
                subscriber.onReject(this.value);
            }
        }

    }


    then(onResolve, onReject){

        let that = this;

        return MyPromise((resolve,reject) =>{
            try {
	            if (that.state === 'resolved') {
		            // execute onresolve handler
		            resolve(onResolve(that.value));
	            }
	            else if (that.state === 'rejected') {
		            //execute onreject handler
		            resolve(onReject(that.value));
	            }
	            else {
		            this.chain.push({onResolve, onReject});
	            }
            }catch(e){
                reject(e);
            }
        });

    }

}