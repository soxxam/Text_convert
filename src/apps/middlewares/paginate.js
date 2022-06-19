

module.exports = (page, totalPage, delta = 2)=>{
    const pages = [], pagesWidthDot = [];

    const left = page - delta;
    const right = page + delta;
    
    for(i = 1; i <= totalPage; i++ ){
        if(i === 1 || i === totalPage || i === page || ( i >= left &&  i <= right)){
            pages.push(i);
        }
    }


    for(i = 0; i < pages.length; i++){
        pagesWidthDot.push(pages[i]);
        if(pages[i+1] - pages[i] >=delta )
            pagesWidthDot.push("...");
    }

    return pagesWidthDot;
}