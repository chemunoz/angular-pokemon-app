import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Pokemon } from '../models/pokemon.model';

@Injectable({
  providedIn: 'root'
})
export class PokemonStorageService {
  private storageKey = 'pokemon_app_custom_pokemon';
  private customPokemonSubject = new BehaviorSubject<Pokemon[]>([]);
  customPokemon$ = this.customPokemonSubject.asObservable();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      this.customPokemonSubject.next(JSON.parse(stored));
    }
  }

  addPokemon(pokemon: Pokemon): void {
    const current = this.customPokemonSubject.value;
    const updated = [...current, pokemon];
    this.customPokemonSubject.next(updated);
    localStorage.setItem(this.storageKey, JSON.stringify(updated));
  }

  deletePokemon(id: number): void {
    const current = this.customPokemonSubject.value;
    const updated = current.filter(p => p.id !== id);
    this.customPokemonSubject.next(updated);
    localStorage.setItem(this.storageKey, JSON.stringify(updated));
  }

  getCustomPokemon(): Pokemon[] {
    return this.customPokemonSubject.value;
  }
}