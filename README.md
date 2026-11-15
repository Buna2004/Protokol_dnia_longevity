# Polish Biohacker — jedna platforma

Nowoczesna, responsywna strona Polish Biohacker zbudowana jako lekka, statyczna witryna możliwa do publikacji na GitHub Pages.

## Nawigacja

- `index.html` — nowa strona główna z fotografią autora.
- `kalkulator.html` — połączony kalkulator energii, białka i spożycia posiłków.
- `protokol.html` — osobisty protokół dnia (rano / trening / sen).
- `bloodwork.html` — archiwalne badania krwi z 15.09.2025.
- `scany.html` — zachowane skany źródłowe.
- `trening.html` — aktualizacja treningu (listopad 2026).
- `performance.html` — archiwum HYROX.
- `mito.html` — koncepcja MITO MORNING, formularz Formspree.
- `dziekuje.html` — potwierdzenie przesłania formularza.
- `assets/site.css` — centralny responsywny design system.
- `assets/site.js` — wspólne menu i stopka.
- `assets/calc.js` — logika kalkulatora z zapisem opcjonalnym wyłącznie na urządzeniu.

Nie potrzebujesz bundlera, Node.js ani serwera aplikacyjnego. Otwórz `index.html` w przeglądarce lub włącz GitHub Pages dla gałęzi `main` i folderu `/` po zaakceptowaniu zmian.

## Kalkulator — założenia

- BMR według równania Mifflina–St Jeora; TDEE = BMR × współczynnik aktywności.
- Aktywność obejmuje też pracę fizyczną, aby uniknąć podwójnego dodawania kalorii.
- Redukcja: –15%; nadwyżka: +8%; utrzymanie i „longevity”: bez automatycznej korekty.
- Białko: regulowany mnożnik g/kg masy ciała.
- Jaja, mięso, serek i whey: wartości uśrednione. Rzeczywiste wartości należy odczytać z opakowań; w przyszłości można dodać edycję produktów.
- Historia obliczeń: `localStorage`, tylko po kliknięciu „Zapisz wynik”, z opcją usunięcia.
- Wartości są edukacyjnymi estymacjami, nie indywidualną poradą żywieniową.

## MITO MORNING — przed uruchomieniem kampanii

Formularz zachowuje dotychczasowy endpoint Formspree (`https://formspree.io/f/xkovanpj`). Należy sprawdzić:
1. Czy endpoint nadal należy do projektu i faktycznie odbiera zgłoszenia.
2. Czy podane są pełne informacje o administratorze danych, celu, okresie przechowywania, prawach i sposobie kontaktu; obecny zwięzły komunikat **nie zastępuje pełnej informacji RODO**.
3. Czy projekt ma zatwierdzoną recepturę, odpowiednie oświadczenia marketingowe oraz ustalone warunki ewentualnej sprzedaży.
4. Czy na skanach badań nie ma danych osobowych wymagających usunięcia.

Usunięto wpisany na sztywno, pozornie „aktualny” licznik zapisów. Strona nie obiecuje daty premiery ani skuteczności produktu.

## Wizualne i manualne testy przed publikacją

- Nawigacja desktop/mobile oraz klawiatura.
- Obliczenia dla skrajnych i zwykłych danych; liczby ujemne i puste pola.
- Zapis i usuwanie historii w różnych przeglądarkach.
- Widok na telefonie, tablecie i komputerze.
- Ładowanie zdjęcia `assets/founder.jpg` i pozostałych obrazów.
- Formularz MITO: poprawny e-mail, zgoda, potwierdzenie, błąd sieci.
- Skany: kontrola anonimizacji danych osobowych.
- Sprawdzenie opublikowanych treści przez autora.

## Zasady publikacji

Strona dokumentuje doświadczenia jednej osoby. To nie są wyniki badań klinicznych ani instrukcje dawkowania. Wiadomości zdrowotne powinny być weryfikowane przed publicznym wykorzystaniem.

**© Polish Biohacker**
