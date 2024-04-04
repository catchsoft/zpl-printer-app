const VENDOR_ID = 2655;

let device;
let label;

export async function printFunc(text) {
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


export async function connectPrinter() {
    // Check if we have devices available
    let devices = await navigator.usb.getDevices();
    device = devices[0];
    label = document.getElementById('label');
    if (devices.length === 0) {
        try {
            // Get permission from the user to use their printer
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
        const printer = document.getElementById('printer');
        printer.innerText = `Printer: ${device.productName}`;
    } else {
        console.log("No devices...");
    }
}