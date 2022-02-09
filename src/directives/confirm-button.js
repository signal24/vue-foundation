import app from '../app';

app.directive('confirm-button', {
    mounted(el) {
        el.addEventListener('click', e => {
            let now = Date.now();

            if (el._isConfirming) {
                if (now - el._confirmInitTime < 300) {
                    return;
                }

                el._resetHandler();
                el.dispatchEvent(new Event('confirm'));
                return;
            }

            e.preventDefault();
            e.stopImmediatePropagation();

            el._resetHandler = () => {
                el.innerHTML = el._preConfirmHTML;
                el.blur();

                el.removeEventListener('mouseout', el._resetHandler);

                delete el._isConfirming;
                delete el._preConfirmHTML;
                delete el._resetHandler;
            };

            el._isConfirming = true;
            el._confirmInitTime = now;
            el._preConfirmHTML = el.innerHTML;
            el.innerHTML = 'Confirm';

            el.addEventListener('mouseout', el._resetHandler);
        });
    }
});
