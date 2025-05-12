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
    moedas: any[] = [];

    constructor(private readonly apiService: ApiService) {}

    ngOnInit() {
    this.apiService.getMoedas().subscribe({
        next: (res) => {
            if (Array.isArray(res)) {
                this.moedas = res.map((item) => item.Moeda); // Extrai apenas os códigos de moeda
                console.log('Moedas carregadas:', this.moedas);
            } else {
                console.error('Resposta inesperada da API:', res);
                this.moedas = [];
            }
        },
        error: (err) => {
            console.error('Erro ao obter moedas:', err);
            this.moedas = [];
        },
    });
}

    converter() {
        const valorNumerico = Number(this.valor);

        if (isNaN(valorNumerico) || valorNumerico < 0) {
            alert('Por favor, insira um valor positivo válido.');
            return;
        }
        
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
