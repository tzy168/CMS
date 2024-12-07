import * as echarts from 'echarts';
import React, { useEffect, useRef } from 'react';
const BarChart = ({ title }) => {
    const chartRef = useRef();
    //保证dom可用 才进行图标渲染
    useEffect(() => {
        const chartDom = chartRef.current;
        const myChart = echarts.init(chartDom);
        const option = {
            title: {
                text: title
            },
            xAxis: {
                type: 'category',
                data: ['Vue', 'React', 'Angular']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    data: [40, 70, 10],
                    type: 'bar'
                }
            ]
        };
        option && myChart.setOption(option);
    }, [title])

    return <div ref={chartRef} style={{ width: '50%', height: '400px' }} />;
};

export default BarChart