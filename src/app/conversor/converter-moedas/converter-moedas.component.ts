import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../api/api.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
    selector: 'app-converter-moedas',
    standalone: true,
    imports: [FormsModule, CommonModule, HttpClientModule],
    providers: [ApiService],
    templateUrl: './converter-moedas.component.html',
    styleUrl: './converter-moedas.component.css',
})
export class ConverterMoedasComponent {
    valor: string = '1';
    de: string = '';
    para: string = '';
    resultado: number | null = null;

    constructor(private readonly apiService: ApiService) {}

    converter() {
        this.apiService.converterMoeda(this.de, this.para, this.valor).subscribe({
            next: res => {
                this.resultado = res;
            },
            error: err => {
                console.error('Erro ao converter moeda:', err);
                alert('Erro ao converter moeda. Verifique os dados e tente novamente.');
                this.resultado = null;
            },
        });
    }
}
