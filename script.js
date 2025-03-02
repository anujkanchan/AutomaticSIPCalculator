let sipChart;

function calculateSIP() {
    let sipAmount = parseFloat(document.getElementById("sipAmount").value);
    let annualRate = parseFloat(document.getElementById("annualRate").value);
    let years = parseInt(document.getElementById("duration").value);

    if (isNaN(sipAmount) || isNaN(annualRate) || isNaN(years) || sipAmount <= 0 || annualRate <= 0 || years <= 0) {
        alert("Please enter valid inputs!");
        return;
    }

    let monthlyRate = (annualRate / 100) / 12;
    let months = years * 12;

    let maturityAmount = sipAmount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    let totalInvestment = sipAmount * months;
    let totalReturns = maturityAmount - totalInvestment;

    let formattedMaturity = formatNumber(maturityAmount);
    let formattedInvestment = formatNumber(totalInvestment);
    let formattedReturns = formatNumber(totalReturns);
    
    let amountInWords = convertToWords(maturityAmount);

    document.getElementById("result").innerHTML = `
        <strong>Total Investment:</strong> ₹${formattedInvestment} <br>
        <strong>Total Returns:</strong> ₹${formattedReturns} <br>
        <strong>Total Maturity:</strong> ₹${formattedMaturity} <br>
        <em>(${amountInWords})</em>
    `;

    updateChart(totalInvestment, totalReturns, maturityAmount);
}

function formatNumber(num) {
    return num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function convertToWords(amount) {
    let ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
    let teens = ["Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    let tens = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    function numToWords(num) {
        if (num === 0) return "Zero";
        let str = "";

        let crore = Math.floor(num / 10000000);
        num %= 10000000;
        let lakh = Math.floor(num / 100000);
        num %= 100000;
        let thousand = Math.floor(num / 1000);
        num %= 1000;
        let hundred = Math.floor(num / 100);
        num %= 100;
        let ten = Math.floor(num / 10);
        let one = num % 10;

        if (crore) str += numToWords(crore) + " Crore ";
        if (lakh) str += numToWords(lakh) + " Lakh ";
        if (thousand) str += numToWords(thousand) + " Thousand ";
        if (hundred) str += ones[hundred] + " Hundred ";
        if (ten > 1) str += tens[ten] + " " + ones[one];
        else if (ten === 1 && one > 0) str += teens[one - 1];
        else if (one) str += ones[one];

        return str.trim();
    }

    let wholePart = Math.floor(amount);
    let decimalPart = Math.round((amount - wholePart) * 100);
    
    let result = numToWords(wholePart) + " Rupees";
    if (decimalPart > 0) {
        result += " and " + numToWords(decimalPart) + " Paise";
    }
    
    return result;
}

function updateChart(totalInvestment, totalReturns, maturityAmount) {
    const ctx = document.getElementById('sipChart').getContext('2d');

    if (sipChart) {
        sipChart.destroy();
    }

    sipChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Total Investment', 'Total Returns', 'Total Maturity'],
            datasets: [{
                label: 'SIP Growth',
                data: [totalInvestment, totalReturns, maturityAmount],
                backgroundColor: ['#4caf50', '#ffa726', '#42a5f5'],
                borderColor: ['#388e3c', '#fb8c00', '#1e88e5'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem) {
                            return `${tooltipItem.label}: ₹${formatNumber(tooltipItem.raw)}`;
                        }
                    }
                }
            }
        }
    });
}

document.getElementById("resetBtn").addEventListener("click", function () {
    document.getElementById("sipAmount").value = "";
    document.getElementById("annualRate").value = "";
    document.getElementById("duration").value = "";
    document.getElementById("result").innerHTML = "";

    if (sipChart) {
        sipChart.destroy();
        sipChart = null;
    }
});
