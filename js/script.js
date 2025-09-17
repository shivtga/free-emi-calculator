document.addEventListener('DOMContentLoaded', () => {
    const loanAmountInput = document.getElementById('loanAmount');
    const rateOfInterestInput = document.getElementById('rateOfInterest');
    const loanTenureInput = document.getElementById('loanTenure');
    const currencySelect = document.getElementById('currency');

    const rateOfInterestValueSpan = document.getElementById('rateOfInterestValue');
    const loanTenureValueSpan = document.getElementById('loanTenureValue');
    const currencySymbol1Span = document.getElementById('currencySymbol1');

    const monthlyEMISpan = document.getElementById('monthlyEMI');
    const principalAmountSpan = document.getElementById('principalAmount');
    const totalInterestSpan = document.getElementById('totalInterest');
    const totalAmountSpan = document.getElementById('totalAmount');

    function calculateEMI() {
        const P = parseFloat(loanAmountInput.value);
        const R = parseFloat(rateOfInterestInput.value) / 100 / 12; // Monthly interest rate
        const N = parseFloat(loanTenureInput.value) * 12; // Total number of months

        if (P > 0 && R > 0 && N > 0) {
            const EMI = P * R * Math.pow((1 + R), N) / (Math.pow((1 + R), N) - 1);
            const totalAmount = EMI * N;
            const totalInterest = totalAmount - P;

            const currencySymbol = currencySelect.value;

            monthlyEMISpan.textContent = `${currencySymbol}${EMI.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
            principalAmountSpan.textContent = `${currencySymbol}${P.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
            totalInterestSpan.textContent = `${currencySymbol}${totalInterest.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
            totalAmountSpan.textContent = `${currencySymbol}${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
        } else {
            monthlyEMISpan.textContent = `${currencySelect.value}0`;
            principalAmountSpan.textContent = `${currencySelect.value}0`;
            totalInterestSpan.textContent = `${currencySelect.value}0`;
            totalAmountSpan.textContent = `${currencySelect.value}0`;
        }
    }

    // Update slider values
    rateOfInterestInput.addEventListener('input', () => {
        rateOfInterestValueSpan.textContent = rateOfInterestInput.value;
        calculateEMI();
    });

    loanTenureInput.addEventListener('input', () => {
        loanTenureValueSpan.textContent = loanTenureInput.value;
        calculateEMI();
    });

    // Update currency symbol
    currencySelect.addEventListener('change', () => {
        currencySymbol1Span.textContent = currencySelect.value;
        calculateEMI();
    });

    // Recalculate EMI on input change
    loanAmountInput.addEventListener('input', calculateEMI);

    // Initial calculation
    calculateEMI();

    // ----------------------------
    // Sharing: enable all buttons
    // ----------------------------
    const shareContainer = document.querySelector('.social-share');
    if (shareContainer) {
        shareContainer.addEventListener('click', async (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;

            // Build dynamic share payload based on current results
            const url = window.location.href;
            const title = 'Free EMI Calculator Result';
            const summary = buildShareSummary();

            // Prefer native share on supported devices (for any button)
            if (navigator.share) {
                try {
                    await navigator.share({
                        title,
                        text: summary,
                        url
                    });
                    return; // Native share handled; stop here
                } catch (err) {
                    // User canceled or share failed — fall back to network-specific flows below
                }
            }

            // Network-specific fallbacks
            if (btn.classList.contains('facebook')) {
                popupShare(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(summary)}`);
            } else if (btn.classList.contains('twitter')) {
                popupShare(`https://twitter.com/intent/tweet?text=${encodeURIComponent(summary)}&url=${encodeURIComponent(url)}`);
            } else if (btn.classList.contains('email')) {
                const subject = encodeURIComponent(title);
                const body = encodeURIComponent(`${summary}\n\n${url}`);
                window.location.href = `mailto:?subject=${subject}&body=${body}`;
            } else if (btn.classList.contains('pinterest')) {
                popupShare(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(summary)}`);
            } else if (btn.classList.contains('linkedin')) {
                // LinkedIn ignores text; it fetches from the URL’s meta. We still include a mini blurb via query if supported.
                popupShare(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`);
            } else if (btn.classList.contains('whatsapp')) {
                // Use api.whatsapp.com for desktop and mobile-agnostic behavior
                window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${summary}\n${url}`)}`, '_blank');
            } else if (btn.classList.contains('telegram')) {
                window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(summary)}`, '_blank');
            }
        });
    }

    function buildShareSummary() {
        const emi = (document.getElementById('monthlyEMI')?.textContent ?? '').trim();
        const principal = (document.getElementById('principalAmount')?.textContent ?? '').trim();
        const interest = (document.getElementById('totalInterest')?.textContent ?? '').trim();
        const total = (document.getElementById('totalAmount')?.textContent ?? '').trim();
        const r = rateOfInterestInput.value;
        const n = loanTenureInput.value;

        return [
            `EMI: ${emi}`,
            `Principal: ${principal}`,
            `Interest: ${interest}`,
            `Total: ${total}`,
            `Rate: ${r}% p.a., Tenure: ${n} years`
        ].join(' | ');
    }

    function popupShare(href) {
        const w = 640;
        const h = 640;
        const y = window.top.outerHeight / 2 + window.top.screenY - (h / 2);
        const x = window.top.outerWidth / 2 + window.top.screenX - (w / 2);
        window.open(
            href,
            '_blank',
            `popup=yes,toolbar=0,location=0,status=0,menubar=0,scrollbars=1,resizable=1,width=${w},height=${h},top=${Math.max(0, y)},left=${Math.max(0, x)}`
        );
    }
});
