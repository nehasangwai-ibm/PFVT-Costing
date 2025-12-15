/**
 * Excel Report Generator
 * Generates Excel reports for cluster analysis
 */

const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

class ExcelGenerator {
    constructor() {
        this.downloadsDir = path.join(__dirname, 'downloads');
        
        // Ensure downloads directory exists
        if (!fs.existsSync(this.downloadsDir)) {
            fs.mkdirSync(this.downloadsDir, { recursive: true });
        }
    }
    
    /**
     * Generate cluster analysis report
     */
    async generateClusterReport(analysisData) {
        try {
            const workbook = new ExcelJS.Workbook();
            
            // Set workbook properties
            workbook.creator = 'IBM MAS PFVT Cost & Sizing Advisor';
            workbook.created = new Date();
            workbook.modified = new Date();
            
            // Create worksheets
            this.createSummarySheet(workbook, analysisData);
            this.createDetailsSheet(workbook, analysisData);
            this.createRecommendationsSheet(workbook, analysisData);
            
            // Generate filename
            const timestamp = new Date().toISOString().split('T')[0];
            const filename = `ibm-cloud-cluster-analysis-${timestamp}.xlsx`;
            const filepath = path.join(this.downloadsDir, filename);
            
            // Save file
            await workbook.xlsx.writeFile(filepath);
            
            return {
                success: true,
                filename: filename,
                filepath: filepath,
                url: `/downloads/${filename}`
            };
        } catch (error) {
            console.error('Error generating Excel report:', error);
            throw new Error(`Failed to generate Excel report: ${error.message}`);
        }
    }
    
    /**
     * Create summary sheet
     */
    createSummarySheet(workbook, data) {
        const sheet = workbook.addWorksheet('Summary', {
            views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }]
        });
        
        // Title
        sheet.mergeCells('A1:D1');
        const titleCell = sheet.getCell('A1');
        titleCell.value = 'IBM Cloud Cluster Analysis Report';
        titleCell.font = { size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
        titleCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF0F62FE' }
        };
        titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
        sheet.getRow(1).height = 30;
        
        // Generated date
        sheet.mergeCells('A2:D2');
        const dateCell = sheet.getCell('A2');
        dateCell.value = `Generated: ${new Date().toLocaleString()}`;
        dateCell.font = { italic: true };
        dateCell.alignment = { horizontal: 'center' };
        
        // Summary metrics
        sheet.addRow([]);
        sheet.addRow(['Metric', 'Value', '', '']);
        
        const summaryData = [
            ['Total Clusters', data.totalClusters],
            ['Total Workers', data.totalWorkers],
            ['Total Monthly Cost', `$${data.totalMonthlyCost.toFixed(2)}`],
            ['Total Yearly Cost', `$${data.totalYearlyCost.toFixed(2)}`],
            ['Total Cost To Date', `$${data.totalCostToDate.toFixed(2)}`],
            ['Average Cost per Cluster', `$${(data.totalMonthlyCost / data.totalClusters).toFixed(2)}/month`]
        ];
        
        summaryData.forEach(row => {
            const addedRow = sheet.addRow(row);
            addedRow.getCell(1).font = { bold: true };
            addedRow.getCell(2).font = { bold: true, color: { argb: 'FF0F62FE' } };
        });
        
        // Cost score distribution
        sheet.addRow([]);
        sheet.addRow(['Cost Score Distribution', '', '', '']);
        
        const greenCount = data.clusters.filter(c => c.costScore === 'GREEN').length;
        const amberCount = data.clusters.filter(c => c.costScore === 'AMBER').length;
        const redCount = data.clusters.filter(c => c.costScore === 'RED').length;
        
        sheet.addRow(['GREEN (Optimal)', greenCount]);
        sheet.addRow(['AMBER (Acceptable)', amberCount]);
        sheet.addRow(['RED (Over-provisioned)', redCount]);
        
        // Style columns
        sheet.getColumn(1).width = 30;
        sheet.getColumn(2).width = 20;
        
        // Style header row
        sheet.getRow(4).font = { bold: true };
        sheet.getRow(4).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE0E0E0' }
        };
    }
    
    /**
     * Create details sheet
     */
    createDetailsSheet(workbook, data) {
        const sheet = workbook.addWorksheet('Cluster Details', {
            views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }]
        });
        
        // Define columns
        sheet.columns = [
            { header: 'Cluster Name', key: 'name', width: 25 },
            { header: 'State', key: 'state', width: 12 },
            { header: 'Created Date', key: 'createdDate', width: 15 },
            { header: 'Uptime', key: 'uptime', width: 15 },
            { header: 'Workers', key: 'workers', width: 10 },
            { header: 'Flavor', key: 'flavor', width: 15 },
            { header: 'CPU/Node', key: 'cpu', width: 10 },
            { header: 'Memory/Node (GB)', key: 'memory', width: 18 },
            { header: 'Disk/Node (GB)', key: 'disk', width: 16 },
            { header: 'Zones', key: 'zones', width: 8 },
            { header: 'Location', key: 'location', width: 15 },
            { header: 'Hourly Cost', key: 'hourly', width: 12 },
            { header: 'Monthly Cost', key: 'monthly', width: 15 },
            { header: 'Yearly Cost', key: 'yearly', width: 15 },
            { header: 'Cost Score', key: 'costScore', width: 12 },
            { header: 'Total Cost To Date', key: 'totalCost', width: 18 }
        ];
        
        // Style header row
        const headerRow = sheet.getRow(1);
        headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF0F62FE' }
        };
        headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
        headerRow.height = 20;
        
        // Add data rows
        data.clusters.forEach(cluster => {
            const row = sheet.addRow({
                name: cluster.name,
                state: cluster.state,
                createdDate: cluster.createdDate,
                uptime: cluster.uptime,
                workers: cluster.workers,
                flavor: cluster.flavor,
                cpu: cluster.cpu || 'N/A',
                memory: cluster.memory || 'N/A',
                disk: cluster.disk || 'N/A',
                zones: cluster.zones,
                location: cluster.location,
                hourly: `$${cluster.costs.hourly.toFixed(2)}`,
                monthly: `$${cluster.costs.monthly.toFixed(2)}`,
                yearly: `$${cluster.costs.yearly.toFixed(2)}`,
                costScore: cluster.costScore,
                totalCost: `$${cluster.totalCostToDate.toFixed(2)}`
            });
            
            // Color code cost score
            const scoreCell = row.getCell('costScore');
            if (cluster.costScore === 'GREEN') {
                scoreCell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FF24A148' }
                };
                scoreCell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
            } else if (cluster.costScore === 'AMBER') {
                scoreCell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFF1C21B' }
                };
                scoreCell.font = { bold: true };
            } else if (cluster.costScore === 'RED') {
                scoreCell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFA4D56' }
                };
                scoreCell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
            }
            
            scoreCell.alignment = { horizontal: 'center', vertical: 'middle' };
        });
        
        // Add totals row
        sheet.addRow({});
        const totalRow = sheet.addRow({
            name: 'TOTAL',
            workers: data.totalWorkers,
            monthly: `$${data.totalMonthlyCost.toFixed(2)}`,
            yearly: `$${data.totalYearlyCost.toFixed(2)}`,
            totalCost: `$${data.totalCostToDate.toFixed(2)}`
        });
        
        totalRow.font = { bold: true };
        totalRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE0E0E0' }
        };
        
        // Add borders to all cells
        sheet.eachRow((row, rowNumber) => {
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });
        });
    }
    
    /**
     * Create recommendations sheet
     */
    createRecommendationsSheet(workbook, data) {
        const sheet = workbook.addWorksheet('Recommendations', {
            views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }]
        });
        
        // Define columns
        sheet.columns = [
            { header: 'Cluster Name', key: 'name', width: 25 },
            { header: 'Cost Score', key: 'costScore', width: 12 },
            { header: 'Current Monthly Cost', key: 'cost', width: 20 },
            { header: 'Recommendations', key: 'recommendations', width: 80 }
        ];
        
        // Style header row
        const headerRow = sheet.getRow(1);
        headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF0F62FE' }
        };
        headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
        headerRow.height = 20;
        
        // Add data rows
        data.clusters.forEach(cluster => {
            const row = sheet.addRow({
                name: cluster.name,
                costScore: cluster.costScore,
                cost: `$${cluster.costs.monthly.toFixed(2)}/month`,
                recommendations: cluster.recommendations.join('\n')
            });
            
            // Enable text wrapping for recommendations
            row.getCell('recommendations').alignment = { wrapText: true, vertical: 'top' };
            row.height = Math.max(20, cluster.recommendations.length * 15);
            
            // Color code cost score
            const scoreCell = row.getCell('costScore');
            if (cluster.costScore === 'GREEN') {
                scoreCell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FF24A148' }
                };
                scoreCell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
            } else if (cluster.costScore === 'AMBER') {
                scoreCell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFF1C21B' }
                };
                scoreCell.font = { bold: true };
            } else if (cluster.costScore === 'RED') {
                scoreCell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFA4D56' }
                };
                scoreCell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
            }
            
            scoreCell.alignment = { horizontal: 'center', vertical: 'middle' };
        });
        
        // Add borders to all cells
        sheet.eachRow((row, rowNumber) => {
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });
        });
    }
}

module.exports = ExcelGenerator;

// Made with Bob
