import { Chart } from 'chart.js';
import { bufferTime, filter, map, tap } from 'rxjs/operators';

import { Qgiv } from 'qgiv/qgiv';
import './thermometer.scss';


/**
 * It's easier to merge the confetti component into this one than try to
 * keep them in sync with separate polling. It also reduces the number of
 * calls to the Qgiv API.
 *
 * TODO: Update Qgiv to use events (Subjects) and/or a shared polling server (Socket.io)
 */
import { ConfettiShower, EAnimationState } from '../confetti/ConfettiShower';
import '../confetti/confetti.scss';
// import { IDonation } from 'qgiv/qgiv.interface';


const _CONFETTI_THRESHOLD = 50;
const _UPDATE_PERIOD_MS = 10_000; // milliseconds

// TODO: https://github.com/nagix/chartjs-plugin-rough
// TODO: https://github.com/nagix/chartjs-plugin-streaming

document.addEventListener('DOMContentLoaded', () => {
    const confettiEls: NodeList = document.querySelectorAll('.confetti-center');
    const milestoneEl = document.getElementById('milestone');
    const text = document.querySelector('.confetti-text');
    const gaugeEl = document.getElementById('gauge') as HTMLCanvasElement;

    const confetti = new ConfettiShower('confetti');
    // const qgiv = new Qgiv();

    // const thermometerConsoleStyle = 'color:red;';
    const confettiConsoleStyle = 'color:pink;';

    const context: CanvasRenderingContext2D = gaugeEl.getContext('2d');
    const myChart = new Chart(context, {
        type: 'horizontalBar',
        data: {
            datasets: [{
                // label: 'donations',
                data: [ 0 ],
                backgroundColor: [ 'rgb(218, 41, 28)' ], // RMHC red
                barPercentage: 1.0,
            }]
        },
        options: {
            legend: {
                display: false,
            },
            scales: {
                xAxes: [{
                    ticks: {
                        beginAtZero: true,
                        suggestedMax: 10000,
                        fontSize: 14,
                        fontColor: 'white',
                        fontStyle: 'bold',
                        callback: (value: number) => '$' + (value/1000) + 'k',
                        padding: 5,
                    },
                    gridLines: {
                        z: 1,
                        lineWidth: 4,
                        color: 'rgba(255, 255, 255, 0.5)',
                        drawTicks: false,
                    },
                }],
            },
            tooltips: {
                enabled: false,
            },
            aspectRatio: 5,
        },
    });


    let launchNum = 0;
    function launchConfetti (milestone: string): void {
        const launchStr = `confetti animation #${launchNum}`;
        launchNum++;

        milestoneEl.textContent = milestone;

        confetti.startAnimation().pipe(
            tap((state) => {
                switch (state) {
                    case EAnimationState.START:
                        console.log(`%c${launchStr} START`, confettiConsoleStyle);
                        text.classList.add('show');
                        break;
                    case EAnimationState.END:
                        console.log(`%c${launchStr} END`, confettiConsoleStyle);
                        text.classList.remove('show');
                        break;
                }
            }),
        ).subscribe(
            () => { /* fires for every emitted state */ },
            error => { console.log(`%c${launchStr} error`, confettiConsoleStyle, error); },
            () => { console.log(`%c${launchStr} complete`, confettiConsoleStyle); }
        );
    }

    // make confetti DIVs a little more than double the (dynamic) height of the thermometer
    function resizeConfetti () {
        const newDim = Math.floor(2 * gaugeEl.clientHeight + 50);

        confettiEls.forEach((val, i) => {
            (val as HTMLElement).style.height = newDim + 'px';
        });
        confetti.resize(newDim);
    }
    window.onresize = () => { resizeConfetti(); };
    resizeConfetti();

    let lastThreshold = 0;
    function updateGauge (amount: number) {
        myChart.data.datasets[0].data[0] = amount;
        myChart.update();

        const nearestDollarTotal = Math.floor(amount);
        if (nearestDollarTotal >= lastThreshold + _CONFETTI_THRESHOLD) {
            // reached a new threshold, determine last threshold amount
            do {
                lastThreshold += _CONFETTI_THRESHOLD;
            } while (lastThreshold + _CONFETTI_THRESHOLD <= nearestDollarTotal);

            launchConfetti('$' + lastThreshold);
        }
    }

    // thermometer won't update until first loop, after _UPDATE_PERIOD_MS
    Qgiv.totalAmount.pipe(
        bufferTime(_UPDATE_PERIOD_MS),
        // skip empty buffers
        filter((amounts: number[]) => amounts.length > 0),
        // take last (most recent) element of buffer
        map((amounts: number[]) => amounts[amounts.length - 1]),
        tap((amount) => {
            updateGauge(amount);
        }),
    ).subscribe();

    // Qgiv pipe unnecessary if just periodically grabbing static value
/*
    console.log('%cthermometer begins polling', thermometerConsoleStyle);
    qgiv.watchTransactions(60_000, thermometerConsoleStyle).pipe(
        tap((x: IDonation) => { console.log('%cthermometer received marble', thermometerConsoleStyle, x.id); }),
        tap(() => {
            myChart.data.datasets[0].data[0] = Qgiv.totalAmount;
            myChart.update();

            const nearestDollarTotal = Math.floor(Qgiv.totalAmount);
            console.log('nearestDollarTotal', nearestDollarTotal, 'lastThreshold (old)', lastThreshold);
            if (nearestDollarTotal >= lastThreshold + _CONFETTI_THRESHOLD) {
                // reached a new threshold, determine last threshold amount
                do {
                    lastThreshold += _CONFETTI_THRESHOLD;
                } while (nearestDollarTotal < lastThreshold)

                console.log('lastThreshold (new)', lastThreshold);
                launchConfetti('$' + lastThreshold);
            }
        }),
    ).subscribe(
        () => { console.log('%csubscribe success', thermometerConsoleStyle); },
        error => { console.log('%csubscribe error', thermometerConsoleStyle, error); },
        () => { console.log('%cthermometer done', thermometerConsoleStyle); }
    );

 */    document.querySelectorAll('.preload').forEach((el) => { el.classList.remove('preload'); });
});
