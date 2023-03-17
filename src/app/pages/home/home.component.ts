import { Component, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  @ViewChild(IonSlides) slides!: IonSlides;
  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    currentIndex
      .then(res => {
        console.log(res)
      })
      .catch(err => console.log(err));
  }
}
