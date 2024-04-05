import { getItem, setItem } from '@/service/BaseStorageService';

const VENDOR_ID = 2655;

let device;
let label;
let broadcast =  new BroadcastChannel('printer')
let isNotMainTab;

export async function printFunc(text) {

    if (isNotMainTab) {
        const printer = getItem('printer');
        if (!printer?.length > 0){
            await connectPrinter();
        }
        else {
            broadcast.postMessage(text);
            return
        }
    }

    if (device) {
        console.log('Printing...');
        const encoder = new TextEncoder();
        text = `^XA^PW400^LL1200^FO20,20^A0N,30,30^FD${text}^FS^XZ`;
        const data = encoder.encode(text);
        try {
            const res = await device.transferOut(1, data);
        } catch (e) {
            alert('Device disconnected!')
        }
    } else {
        alert('No device!');
    }
}


export async function listenBroadcastForMainTab() {
    broadcast.onmessage = (event) => {
        console.log(event.data)
        if (event.data) {
            printFunc(event.data)
        }
    }
}


export async function connectPrinter() {
    const printerLabel = document.getElementById('printer');

    const printer = getItem('printer');
    if (printer?.length > 0) {
        printerLabel.innerText = `Printer: ${printer}`;
        isNotMainTab = true;
        return
    }


    let devices = await navigator.usb.getDevices();
    device = devices[0];
    label = document.getElementById('label');
    if (devices.length === 0) {
        try {
            device = await navigator.usb.requestDevice({filters: [{vendorId: VENDOR_ID}]});
        } catch (e) {
            label.innerText = 'Please give permission to get the USB printer...';
            console.warn(e);
        }
    }
    if (device) {
        await device.open();
        await device.selectConfiguration(1);
        await device.claimInterface(0);
        setItem('printer', device.productName)
        listenBroadcastForMainTab();

        window.addEventListener('beforeunload', () => {
            broadcast.postMessage(
                'close'
            );
            setItem('printer', '')
        })


        printerLabel.innerText = `Printer: ${device.productName}`;
    } else {
        console.log("No devices...");
    }
}