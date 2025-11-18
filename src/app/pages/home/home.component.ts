import { Component } from '@angular/core';
import { ConversorComponent } from '../../components/conversor/conversor.component';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [ConversorComponent, HeaderComponent, FooterComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
})
export class HomeComponent {
    
}
