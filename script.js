let investmentChart = null;

function calculateReturns() {
    const initialInvestment = parseFloat(document.getElementById('initialInvestment').value);
    const stockReturn = parseFloat(document.getElementById('stockReturn').value) / 100;
    const propertyReturn = parseFloat(document.getElementById('propertyReturn').value) / 100;
    
    const years = 20;
    const results = [];
    
    // Calculate returns for each year
    for (let year = 0; year <= years; year++) {
        const stockValue = initialInvestment * Math.pow(1 + stockReturn, year);
        const propertyValue = initialInvestment * Math.pow(1 + propertyReturn, year);
        
        // Calculate leveraged property returns based on equity growth
        // 25% leverage: You put in £100k, bank puts in £33.3k (total property £133.3k)
        const propertyValue25 = (initialInvestment * 1.333) * Math.pow(1 + propertyReturn, year);
        const borrowed25 = initialInvestment * 0.333; // Fixed loan amount
        const leverage25 = propertyValue25 - borrowed25;
        
        // 50% leverage: You put in £100k, bank puts in £100k (total property £200k)
        const propertyValue50 = (initialInvestment * 2) * Math.pow(1 + propertyReturn, year);
        const borrowed50 = initialInvestment * 1; // Fixed loan amount
        const leverage50 = propertyValue50 - borrowed50;
        
        // 75% leverage: You put in £100k, bank puts in £300k (total property £400k)
        const propertyValue75 = (initialInvestment * 4) * Math.pow(1 + propertyReturn, year);
        const borrowed75 = initialInvestment * 3; // Fixed loan amount
        const leverage75 = propertyValue75 - borrowed75;
        
        results.push({
            year,
            stockValue,
            propertyValue,
            leverage25,
            leverage50,
            leverage75
        });
    }
    
    updateTable(results);
    updateChart(results);
}

function updateTable(results) {
    const tbody = document.querySelector('#resultsTable tbody');
    tbody.innerHTML = '';
    
    const initialInvestment = parseFloat(document.getElementById('initialInvestment').value);
    
    // Add year-by-year results
    results.forEach(result => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${result.year}</td>
            <td>£${result.stockValue.toLocaleString('en-GB', {maximumFractionDigits: 0})}</td>
            <td>£${result.propertyValue.toLocaleString('en-GB', {maximumFractionDigits: 0})}</td>
            <td>£${result.leverage25.toLocaleString('en-GB', {maximumFractionDigits: 0})}</td>
            <td>£${result.leverage50.toLocaleString('en-GB', {maximumFractionDigits: 0})}</td>
            <td>£${result.leverage75.toLocaleString('en-GB', {maximumFractionDigits: 0})}</td>
        `;
        tbody.appendChild(row);
    });
    
    // Add summary row
    const years = results.length - 1; // -1 because we include year 0
    
    const finalStockValue = results[results.length - 1].stockValue;
    const finalPropertyValue = results[results.length - 1].propertyValue;
    const finalLeverage25 = results[results.length - 1].leverage25;
    const finalLeverage50 = results[results.length - 1].leverage50;
    const finalLeverage75 = results[results.length - 1].leverage75;
    
    // Calculate CAGR for each scenario
    const stockCAGR = (Math.pow(finalStockValue / initialInvestment, 1/years) - 1) * 100;
    const propertyCAGR = (Math.pow(finalPropertyValue / initialInvestment, 1/years) - 1) * 100;
    const leverage25CAGR = (Math.pow(finalLeverage25 / initialInvestment, 1/years) - 1) * 100;
    const leverage50CAGR = (Math.pow(finalLeverage50 / initialInvestment, 1/years) - 1) * 100;
    const leverage75CAGR = (Math.pow(finalLeverage75 / initialInvestment, 1/years) - 1) * 100;
    
    const summaryRow = document.createElement('tr');
    summaryRow.classList.add('summary-row');
    summaryRow.innerHTML = `
        <td><strong>Summary</strong><br>Total Return<br>Annual Return</td>
        <td>
            <strong>£${(finalStockValue - initialInvestment).toLocaleString('en-GB', {maximumFractionDigits: 0})}</strong><br>
            ${stockCAGR.toFixed(1)}%
        </td>
        <td>
            <strong>£${(finalPropertyValue - initialInvestment).toLocaleString('en-GB', {maximumFractionDigits: 0})}</strong><br>
            ${propertyCAGR.toFixed(1)}%
        </td>
        <td>
            <strong>£${(finalLeverage25 - initialInvestment).toLocaleString('en-GB', {maximumFractionDigits: 0})}</strong><br>
            ${leverage25CAGR.toFixed(1)}%
        </td>
        <td>
            <strong>£${(finalLeverage50 - initialInvestment).toLocaleString('en-GB', {maximumFractionDigits: 0})}</strong><br>
            ${leverage50CAGR.toFixed(1)}%
        </td>
        <td>
            <strong>£${(finalLeverage75 - initialInvestment).toLocaleString('en-GB', {maximumFractionDigits: 0})}</strong><br>
            ${leverage75CAGR.toFixed(1)}%
        </td>
    `;
    tbody.appendChild(summaryRow);
}

function updateChart(results) {
    const ctx = document.getElementById('investmentChart').getContext('2d');
    
    if (investmentChart) {
        investmentChart.destroy();
    }
    
    investmentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: results.map(result => `Year ${result.year}`),
            datasets: [
                {
                    label: 'Stocks',
                    data: results.map(result => result.stockValue),
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                },
                {
                    label: 'Property',
                    data: results.map(result => result.propertyValue),
                    borderColor: 'rgb(255, 99, 132)',
                    tension: 0.1
                },
                {
                    label: 'Property 25% Leverage',
                    data: results.map(result => result.leverage25),
                    borderColor: 'rgb(255, 159, 64)',
                    tension: 0.1
                },
                {
                    label: 'Property 50% Leverage',
                    data: results.map(result => result.leverage50),
                    borderColor: 'rgb(153, 102, 255)',
                    tension: 0.1
                },
                {
                    label: 'Property 75% Leverage',
                    data: results.map(result => result.leverage75),
                    borderColor: 'rgb(54, 162, 235)',
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '£' + value.toLocaleString('en-GB');
                        }
                    }
                }
            }
        }
    });
}

// Calculate initial values when page loads
document.addEventListener('DOMContentLoaded', calculateReturns); 