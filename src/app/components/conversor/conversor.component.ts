import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../api/api.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
    selector: 'app-conversor',
    standalone: true,
    imports: [FormsModule, CommonModule, HttpClientModule],
    providers: [ApiService],
    templateUrl: './conversor.component.html',
    styleUrl: './conversor.component.css',
})
export class ConversorComponent {
    valor: string = '1';
    de: string = 'BRL';
    para: string = 'USD';
    resultado: number | null = null;
    moedas: any[] = [];

    constructor(private readonly apiService: ApiService) {}

    ngOnInit() {
        this.apiService.getMoedas().subscribe({
            next: res => {
                if (Array.isArray(res)) {
                    this.moedas = res.map(item => item.Moeda);
                    console.log('Moedas carregadas:', this.moedas);

                    this.converter();
                } else {
                    console.error('Resposta inesperada da API:', res);
                    this.moedas = [];
                }
            },
            error: err => {
                console.error('Erro ao obter moedas:', err);
                this.moedas = [];
            },
        });
    }

    converterDireta() {
        if (!this.valor || this.valor.trim() === '') {
            this.valor = '0';
        }
        const valorNumerico = Number(this.valor);

        if (isNaN(valorNumerico) || valorNumerico < 0) {
            alert('Por favor, insira um valor positivo válido.');
            return;
        }

        this.apiService
            .converterMoeda(this.de, this.para, this.valor)
            .subscribe({
                next: res => {
                    this.resultado = Number(Number(res).toFixed(2));
                },
                error: err => {
                    console.error('Erro ao converter moeda:', err);
                    alert(
                        'Erro ao converter moeda. Verifique os dados e tente novamente.',
                    );
                    this.resultado = null;
                },
            });
    }

    converterInversa() {
        if (!this.resultado) {
            this.resultado = 0;
            return;
        }

        this.apiService
            .converterMoeda(this.para, this.de, this.resultado.toString())
            .subscribe({
                next: res => {
                    this.valor = Number(Number(res).toFixed(2)).toString();
                },
                error: err => {
                    console.error('Erro ao converter moeda:', err);
                    alert(
                        'Erro ao converter moeda. Verifique os dados e tente novamente.',
                    );
                    this.valor = '0';
                },
            });
    }

    converter() {
        this.converterDireta();
    }

    trocarMoedas() {
        const temp = this.de;
        this.de = this.para;
        this.para = temp;
        if (this.valor) {
            this.converterDireta();
        }
    }
    formatValue(value: string): string {
        if (value.includes('.')) {
            const [intPart, decPart] = value.split('.');
            return `${parseInt(intPart || '0')}.${decPart}`;
        }
        return value ? `${parseInt(value)}` : '0';
    }

    onInputChange(event: Event) {
        const input = event.target as HTMLInputElement;
        let value = input.value;

        value = value.replace(/[^\d.]/g, '');

        const parts = value.split('.');
        if (parts.length > 2) {
            value = `${parts[0]}.${parts.slice(1).join('')}`;
        }

        this.valor = this.formatValue(value);
        this.converter();
    }

    onInputChangeInverso(event: Event) {
        const input = event.target as HTMLInputElement;
        let value = input.value;

        value = value.replace(/[^\d.]/g, '');

        const parts = value.split('.');
        if (parts.length > 2) {
            value = `${parts[0]}.${parts.slice(1).join('')}`;
        }

        this.resultado = Number(this.formatValue(value));
        this.converterInversa();
    }
}
