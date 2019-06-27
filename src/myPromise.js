class MyPromise{

    constructor(executor){

        let resolve = (value) => {

            if(this.state !== 'pending')
            {
                return;
            }

            this.state = 'resolved';
            this.value = value;
            let then = value.then !== null ? v.then : null;
            if(then instanceof Function){
                then(resolve,reject);
            }

            notifySubscribers();
        };

        let reject = (value) =>{
            if(this.state !=='pending')
            {
                return;
            }

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

    static all(listPromises){
        // wait for all of them to complete
        let results = [];
        let totalResolved = 0;

       return MyPromise((resolve,reject) =>{
          listPromises.forEach((promise)=>{
              promise.then((result)=>{
                  results.add(result);totalResolved++;
                  if(totalResolved===listPromises.length) resolve(results);
              }, (error) => reject(error));
          })
        });
    }

    static race(listPromise){

        return MyPromise((resolve,reject)=>{
            listPromise.forEach( promise =>{
                promise.then(result => resolve(result),error => reject(error));
            })
        })

    }

    static resolve(value){
        return MyPromise(resolve => resolve(value));
    }

    static reject(value){
        return MyPromise((resolve,reject) => reject(value));
    }

}