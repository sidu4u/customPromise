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

        return MyPromise((resolve,reject) =>{
            if(this.state === 'resolved')
            {
                // execute onresolve handler
                onResolve(this.value);
            }
            else if(this.state === 'rejected')
            {
                //execute onreject handler
                onReject(this.value);
            }
            else{
                this.chain.push({onResolve,onReject});
            }
        });

    }

}