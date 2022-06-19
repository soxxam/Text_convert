if(localStorage.getItem("User")){
    if(JSON.parse(localStorage.getItem("User")).PriceId){
        let dayEnd = JSON.parse(localStorage.getItem("User")).dayEnd
        let today = new Date();
        const yyyy = today.getFullYear();
        let mm = today.getMonth() + 1; 
        let dd = today.getDate();
        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;
        today = yyyy + "-" + mm + '-' + dd 
        if(dayEnd == today){
            let user = JSON.parse(localStorage.getItem("User"))
            delete user.PriceId
            localStorage.setItem("User", JSON.stringify(user))
        }
    }
    
}