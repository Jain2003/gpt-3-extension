if(!location.href.startsWith('https://abs.com/')){
    chrome.action.disable();
}


const insert = (content) => {
    // const elements = document.getElementsByClassName('droid');
    const elements = document.getElementsByClassName('_9c5f1d66-denali-editor-editor ql-editor');
    if(elements.length === 0){
        return;
    }
    const element = elements[0];

    const elementDiv = document.getElementsByClassName('_9c5f1d66-denali-editor-editor ql-editor');

    const pToRemove = element.childNodes[0];
    pToRemove.remove();
    const splitContent = content.split('\n');
    splitContent.forEach((content) => {
        const p = document.createElement('p');

        if(content === ''){
            const br = document.createElement('br');
            p.appendChild(br);
        }else {
            p.textContent = content;
        }
        element.appendChild(p);
    });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.message === 'inject'){
        const { content } = request;

        const result = insert(content);

        if(!result){
            sendResponse({status: 'failed'});
        }

        console.log(content);

        sendResponse({status: 'success'});
    }
})