import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService, IMoeda } from '../../api/api.service';
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
    deNome: string = 'Real Brasileiro'; 
    para: string = 'USD';
    paraNome: string = 'Dólar Dos Estados Unidos';
    resultado: number | null = null;
    moedas: IMoeda[] = [];
    dropdownOrigemOpen: boolean = false;
    dropdownDestinoOpen: boolean = false;
    procurarOrigem: string = '';
    procurarDestino: string = '';
    ///////////////////////////////////////////


    constructor(private readonly apiService: ApiService) {}

    ngOnInit() {
        this.apiService.getMoedas().subscribe({
            next: res => {
                if (Array.isArray(res)) {
                    this.moedas = res; // Extrai apenas os códigos de moeda
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
                    alert('Erro ao converter moeda. Verifique os dados e tente novamente.');
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
                    alert('Erro ao converter moeda. Verifique os dados e tente novamente.');
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

    filtrarMoedas(procura: string): IMoeda[] {
        if (!procura) return this.moedas;
        procura = procura.toLowerCase();
        return this.moedas.filter(moeda => 
            moeda.Moeda.toLowerCase().includes(procura) ||
            moeda.Nome.toLowerCase().includes(procura)
        );
    }
    toggleDropdownOrigem(){
        this.dropdownOrigemOpen = !this.dropdownOrigemOpen;
        this.dropdownDestinoOpen = false;
    }

    toggleDropdownDestino(){
        this.dropdownDestinoOpen = !this.dropdownDestinoOpen;
        this.dropdownOrigemOpen = false;
    }

    selecionarMoedaOrigem(moedaCodigo: string) {
        this.de = moedaCodigo;
        this.deNome = this.moedas.find(m => m.Moeda === moedaCodigo)?.Nome || 'Moeda Desconhecida';
        this.dropdownOrigemOpen = false;
        this.converter();
    }

    selecionarMoedaDestino(moedaCodigo: string) {
        this.para = moedaCodigo;
        this.paraNome = this.moedas.find(m => m.Moeda === moedaCodigo)?.Nome || 'Moeda Desconhecida';
        this.dropdownDestinoOpen = false;
        this.converter();
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
        const targetElement = event.target as HTMLElement;
        
        // Fecha dropdown se clicar fora
        if (!targetElement.closest('#origem-valor')) {
            this.dropdownOrigemOpen = false;
        }
        if (!targetElement.closest('#destno-valor')) {
            this.dropdownDestinoOpen = false;
        }
    }

    formatValue(value: string): string {
        if (value.includes('.')) {
            const [intPart, decPart] = value.split('.');
            return `${parseInt(intPart || '0')}.${decPart}`;
        }
        // Remove zeros à esquerda de números inteiros
        return value ? `${parseInt(value)}` : '0';
    }

    onInputChange(event: Event) {
        const input = event.target as HTMLInputElement;
        let value = input.value;

        // Remove caracteres não numéricos, exceto ponto
        value = value.replace(/[^\d.]/g, '');

        // Garante que há apenas um ponto decimal
        const parts = value.split('.');
        if (parts.length > 2) {
            value = `${parts[0]}.${parts.slice(1).join('')}`;
        }

        // Formata o valor
        this.valor = this.formatValue(value);
        this.converter();
    }

    onInputChangeInverso(event: Event) {
        const input = event.target as HTMLInputElement;
        let value = input.value;

        // Remove caracteres não numéricos, exceto ponto
        value = value.replace(/[^\d.]/g, '');

        // Garante que há apenas um ponto decimal
        const parts = value.split('.');
        if (parts.length > 2) {
            value = `${parts[0]}.${parts.slice(1).join('')}`;
        }

        // Formata o valor e converte para número
        this.resultado = Number(this.formatValue(value));
        this.converterInversa();
    }
}
