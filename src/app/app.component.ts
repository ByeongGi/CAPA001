import { Component, OnInit } from '@angular/core';
import {
  Plugins,
  ActionSheetOptionStyle,
  CameraResultType,
  CameraSource
} from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

const { Device, Network, Browser, Geolocation, Toast, Modals } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'capa001';
  deviceInfo;
  networkInfo;
  currentPositionInfo;
  watchPositionInfo;

  image: SafeResourceUrl ;

  constructor(private sanitizer: DomSanitizer) {}
  ngOnInit(): void {
    this.getDevice();
  }

  async getDevice() {
    // const info = await Device.getInfo();
    console.log((this.deviceInfo = await Device.getInfo()));
    console.log((this.networkInfo = await Network.getStatus()));
    this.currentPositionInfo = this.getCurrentPosition();
    this.watchPosition();
  }

  openBrowser() {
    Browser.open({
      url: 'https://naver.com',
      toolbarColor: 'blue',
      windowName: 'TEST',
      presentationStyle: 'popover'
    });
  }

  closerBrowser() {
    Browser.close();
  }
  prefetchBrowser() {
    Browser.prefetch({
      urls: ['https://naver.com']
    });
  }

  async getCurrentPosition() {
    const coordinates = await Geolocation.getCurrentPosition();
    console.log('Current', coordinates);
  }

  watchPosition() {
    const wait = Geolocation.watchPosition({}, (position, err) => {
      this.watchPositionInfo = position;
      console.log(err);
    });
  }

  async showToast() {
    await Toast.show({
      duration: 'short',
      text: 'Hello!'
    });
  }

  async showAlert() {
    const alertRet = await Modals.alert({
      title: 'Stop',
      message: 'this is an error'
    });
  }

  async showConfirm() {
    const confirmRet = await Modals.confirm({
      title: 'Confirm',
      message: 'Are you sure you\'d like to press the red button?'
    });
    console.log('Confirm ret', confirmRet);
  }

  async showPrompt() {
    const promptRet = await Modals.prompt({
      title: 'Hello',
      message: 'What\'s your name?'
    });
    console.log('Prompt ret', promptRet);
  }

  async showActions() {
    const promptRet = await Modals.showActions({
      title: 'Photo Options',
      message: 'Select an option to perform',
      options: [
        {
          title: 'Upload'
        },
        {
          title: 'Share'
        },
        {
          title: 'Remove',
          style: ActionSheetOptionStyle.Destructive
        }
      ]
    });
    console.log('You selected', promptRet);
  }

  async takePicture() {
    const { Camera } = Plugins;

    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera
    });

    // Example of using the Base64 return type. It's recommended to use CameraResultType.Uri
    // instead for performance reasons when showing large, or a large amount of images.
    this.image = this.sanitizer.bypassSecurityTrustResourceUrl(
      image && image.base64Data
    );
  }
}
