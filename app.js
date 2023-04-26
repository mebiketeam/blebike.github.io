'use strict';

const UUID = '19b10000-e8f2-537e-4f6c-d104768a1214';
const SERVICE_UUID = '19b10001-e8f2-537e-4f6c-d104768a1214';
let g_characteristic = {};
const $light = document.querySelector('#light');
const $dark = document.querySelector('#dark');
const $link = document.querySelector('#link');
const $bulb = document.querySelector('.bulb');

const lightOn = () => {
  g_characteristic.readValue()
    .then((val) => {
      let led_state = val.getUint8(0);
      led_state = 1; // LEDを点灯するため、常に 1 をセットする
      g_characteristic.writeValue(new Uint8Array([led_state]));
      toggleClass(led_state);
    })
}

const darkOn = () => {
  g_characteristic.readValue()
    .then((val) => {
      let led_state = val.getUint8(0);
      led_state = 0; // LEDを消灯するため、常に 0 をセットする
      g_characteristic.writeValue(new Uint8Array([led_state]));
      toggleClass(led_state);
    })
}

const main = () => {
  return navigator.bluetooth.requestDevice({acceptAllDevices:true, optionalServices:[UUID]})
  .then(device => {
    console.log(device);
    console.log('> Name:             ' + device.name);
    console.log('> Id:               ' + device.id);
    console.log('> Connected:        ' + device.gatt.connected);
    console.log('--デバイスに接続中です...--');
    return device.gatt.connect();
  })
  .then(server => {
      console.log('Getting ___ Service...');
      return server.getPrimaryService(UUID);
  })
  .then(service => {
      console.log('Getting ____ Characteristic...');
      return service.getCharacteristic(SERVICE_UUID);
    })
  .then(characteristic => {
      g_characteristic = characteristic;
      $light.removeEventListener('click', main);
      $light.addEventListener('click', lightOn); // "light" ボタンがクリックされたときに lightOn 関数を呼び出すように変更
      $dark.addEventListener('click', darkOn);   // "dark" ボタンがクリックされたときに darkOn 関数を呼び出すように追加
      return characteristic;
    })
  .catch(error => {
    console.log('Argh! ' + error);
  });
}

/**
 * 
 */
function toggleClass(led_state){
  if(led_state){
    addClass('#ff0000');
  }else{
    removeClass();
  }
}

function removeClass(){
    $bulb.style.background = '#bbb';
    $bulb.style.boxShadow = '';
    $bulb.classList.remove("light_up");
}

function addClass(color){
    $bulb.style.background = color;
    $bulb.style.boxShadow = `0 -10px 100px ${color}`;
    $bulb.classList.add("light_up");
}

$light.addEventListener('click', main);
$link.addEventListener('click', main);
