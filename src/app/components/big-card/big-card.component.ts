import { Component, Input} from '@angular/core';
import { HomeComponent } from '../../pages/home/home.component';

@Component({
  selector: 'app-big-card',
  imports: [HomeComponent],
  templateUrl: './big-card.component.html',
  styleUrl: './big-card.component.css'
})
export class BigCardComponent {
  @Input()
  photoCover: string = '';
  @Input()
  cardTitle: string = '';
  @Input()
  cardDescription: string = '';

}
