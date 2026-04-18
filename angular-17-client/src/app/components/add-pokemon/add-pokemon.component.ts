import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PokemonStorageService } from '../../services/pokemon-storage.service';
import { Pokemon } from '../../models/pokemon.model';

@Component({
  selector: 'app-add-pokemon',
  templateUrl: './add-pokemon.component.html',
  styleUrls: ['./add-pokemon.component.css']
})
export class AddPokemonComponent {
  name = '';
  imageUrl = '';
  selectedTypes: string[] = [];

  pokemonTypes = [
    'normal', 'fire', 'water', 'electric', 'grass', 'ice',
    'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
    'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
  ];

  constructor(
    private pokemonStorage: PokemonStorageService,
    private router: Router
  ) {}

  getTypeColor(type: string): string {
    const colors: { [key: string]: string } = {
      normal: '#A8A878',
      fire: '#F08030',
      water: '#6890F0',
      electric: '#F8D030',
      grass: '#78C850',
      ice: '#98D8D8',
      fighting: '#C03028',
      poison: '#A040A0',
      ground: '#E0C068',
      flying: '#A890F0',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0',
      fairy: '#EE99AC'
    };
    return colors[type] || '#A8A878';
  }

  onTypeChange(type: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedTypes.push(type);
    } else {
      this.selectedTypes = this.selectedTypes.filter(t => t !== type);
    }
  }

  onSubmit(): void {
    if (!this.name.trim() || !this.imageUrl.trim() || this.selectedTypes.length === 0) {
      alert('Please fill all fields');
      return;
    }

    const customPokemon: Pokemon = {
      id: Date.now(),
      name: this.name.toLowerCase(),
      sprites: {
        front_default: this.imageUrl,
        other: {
          'official-artwork': { front_default: this.imageUrl },
          dream_world: { front_default: this.imageUrl }
        }
      },
      types: this.selectedTypes.map((type, index) => ({
        slot: index + 1,
        type: { name: type, url: '' }
      })),
      abilities: [],
      stats: [
        { base_stat: 50, stat: { name: 'hp', url: '' } },
        { base_stat: 50, stat: { name: 'attack', url: '' } },
        { base_stat: 50, stat: { name: 'defense', url: '' } },
        { base_stat: 50, stat: { name: 'speed', url: '' } }
      ],
      height: 10,
      weight: 50,
      isCustom: true
    };

    this.pokemonStorage.addPokemon(customPokemon);
    this.router.navigate(['/pokemon']);
  }

  cancel(): void {
    this.router.navigate(['/pokemon']);
  }
}