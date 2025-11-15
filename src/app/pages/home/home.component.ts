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
    ngOnInit(): void {
        alert(`Olá seja bem vindo.
Esse projeto é apenas um projeto de estudo. Sendo assim a hospedagem é gratuita e pode apresentar instabilidades, se for a primeira vez abrindo a página aguarde uns segundos até que a API carregue no servidor.`);
    }
}
