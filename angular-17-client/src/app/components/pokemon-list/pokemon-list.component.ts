import { Component, OnInit } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { Pokemon } from '../../models/pokemon.model';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css']
})
export class PokemonListComponent implements OnInit {
  pokemonList: Pokemon[] = [];
  allPokemon: Pokemon[] = [];
  currentPokemon: Pokemon | null = null;
  currentIndex = -1;
  searchName = '';
  totalCount = 0;
  currentPage = 1;
  pageSize = 20;
  loading = false;

  private searchSubject = new Subject<string>();

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.loadPokemon();

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.filterPokemon(searchTerm);
    });
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchName);
  }

  filterPokemon(searchTerm: string): void {
    if (searchTerm.length < 3) {
      this.pokemonList = [...this.allPokemon];
      return;
    }

    this.pokemonList = this.allPokemon.filter(pokemon => 
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  loadPokemon(offset: number = 0): void {
    this.loading = true;
    this.pokemonService.getPokemonList(this.pageSize, offset).subscribe({
      next: (data) => {
        this.totalCount = data.count;
        this.pokemonList = [];
        this.allPokemon = [];
        
        const pokemonNames = data.results.map(r => r.name);
        
        pokemonNames.forEach((name, index) => {
          this.pokemonService.getPokemon(name).subscribe({
            next: (pokemon) => {
              this.allPokemon[index] = pokemon;
              if (this.searchName.length < 3) {
                this.pokemonList = [...this.allPokemon];
              }
              this.pokemonList = this.allPokemon.filter(p => p !== undefined);
            },
            error: (e) => console.error(e)
          });
        });
        
        this.loading = false;
      },
      error: (e) => {
        console.error(e);
        this.loading = false;
      }
    });
  }

  setActivePokemon(pokemon: Pokemon, index: number): void {
    this.currentPokemon = pokemon;
    this.currentIndex = index;
  }

  searchByName(): void {
    if (!this.searchName.trim()) {
      this.loadPokemon();
      return;
    }
    
    this.loading = true;
    this.pokemonService.getPokemon(this.searchName.toLowerCase()).subscribe({
      next: (data) => {
        this.pokemonList = [data];
        this.currentPokemon = null;
        this.currentIndex = -1;
        this.loading = false;
      },
      error: (e) => {
        console.error(e);
        this.pokemonList = [];
        this.loading = false;
      }
    });
  }

  nextPage(): void {
    if ((this.currentPage * this.pageSize) < this.totalCount) {
      this.currentPage++;
      this.loadPokemon((this.currentPage - 1) * this.pageSize);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadPokemon((this.currentPage - 1) * this.pageSize);
    }
  }

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
}