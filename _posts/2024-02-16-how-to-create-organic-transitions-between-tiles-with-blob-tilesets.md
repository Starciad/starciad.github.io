---
layout: post
section: blog
label: how-to-create-organic-transitions-between-tiles-with-blob-tilesets

title: Como criar transições orgânicas entre tiles com Blob Tilesets
author: Starciad
category: Desenvolvimento de Jogos
tags: [Desenvolvimento de Jogos, Pixel Art, Blob Tileset, Autotiling, Renderização]
date: 2024-02-16
---

### Introdução

Em jogos baseados em mapas compostos por *tiles*, é comum que elementos do cenário sejam organizados sobre uma grade. Essa abordagem é extremamente conveniente para representar terrenos, paredes, líquidos e outros componentes do mundo, mas também apresenta um problema visual bastante evidente: quando dois elementos diferentes são colocados lado a lado, a transição entre eles tende a ficar excessivamente rígida.

Uma maneira de solucionar esse problema é utilizar um ***Blob Tileset***, uma técnica de *autotiling* capaz de determinar automaticamente a aparência de um *tile* de acordo com os elementos que o cercam.

A ideia é relativamente simples: em vez de armazenar uma imagem diferente para cada possível configuração de vizinhança, dividimos visualmente cada *tile* em partes menores e determinamos, para cada uma delas, quais bordas e cantos devem ser exibidos. O resultado é um sistema capaz de produzir uma grande variedade de configurações utilizando apenas **47 *sprites***.

Essa técnica também aparece sob outros nomes e em diferentes ferramentas. No *Unity*, conceitos semelhantes são frequentemente associados aos ***Rule Tiles***, enquanto na comunidade do *RPG Maker VX* ela é conhecida por sua relação com os ***autotiles* A2 de terreno**. Neste artigo, utilizarei o termo ***Blob Tileset***, que é particularmente apropriado para a abordagem apresentada aqui.

Durante o desenvolvimento do ***Pixel Dust***, antigo nome do projeto que posteriormente se tornou o *Stardust Sandbox*, implementei uma variação desse sistema diretamente durante o processo de renderização. A experiência acabou se tornando um bom exemplo de como uma técnica relativamente simples pode melhorar significativamente a aparência de mapas baseados em uma grade.

---

#### O problema: *tiles* independentes

Considere um mapa no qual cada célula pode conter um elemento sólido. Uma abordagem tradicional consiste simplesmente em desenhar o *sprite* correspondente àquele elemento em sua posição na grade.

Isso funciona perfeitamente enquanto cada *tile* puder ser visualmente independente. O problema aparece quando queremos que dois elementos pareçam pertencer a uma mesma superfície ou que um material faça uma transição suave para outro.

Sem algum tipo de tratamento adicional, as fronteiras entre os elementos permanecem perfeitamente alinhadas à grade:

![Imagem](https://github.com/Starciad/PixelDustSandbox/assets/69594923/33109b4c-8c23-4726-a245-f2dc851be24c)

![Imagem](https://github.com/Starciad/PixelDustSandbox/assets/69594923/ef1787ff-729d-497d-8eb1-edc08a215850)

Visualmente, isso pode deixar o cenário excessivamente artificial. Mesmo quando a lógica do jogo continua sendo completamente baseada em uma grade, podemos fazer a representação gráfica parecer muito mais orgânica.

É justamente nesse ponto que entra o *Blob Tileset*.

---

#### O que é um *Blob Tileset*?

Trata-se de um conjunto de *sprites* projetado para representar as diferentes maneiras pelas quais uma determinada superfície pode se conectar às suas vizinhas.

Embora seja possível imaginar um *sprite* diferente para cada configuração de vizinhança, isso rapidamente se torna impraticável.

Se considerarmos os oito vizinhos de uma célula, teríamos:

$$
2^8 = 256
$$

possíveis combinações de presença ou ausência de vizinhos.

Entretanto, muitas dessas combinações são equivalentes do ponto de vista visual. Além disso, o objetivo de um *Blob Tileset* não é necessariamente representar individualmente todos os oito vizinhos, mas determinar como as bordas e os cantos de uma superfície devem ser desenhados.

Essa observação permite reduzir drasticamente a quantidade de *sprites* necessária.

Um *Blob Tileset* tradicional consegue representar essas conexões com **47 *sprites***.

A grande vantagem está justamente nessa redução: em vez de criar centenas de imagens diferentes, construímos o *tile* final a partir de pequenas partes reutilizáveis.

---

### Estrutura do sistema

A abordagem utilizada no *Pixel Dust* parte de um conjunto básico de cinco categorias de partes:

- **Inteiro**
- **Cantos**
- **Bordas horizontais**
- **Bordas verticais**
- **Lacunas**

![Conjunto de partes](https://github.com/Starciad/PixelDust/assets/69594923/2539c95c-712c-472a-b92d-c731417c1041)

Essas categorias não precisam necessariamente ser implementadas como *sprites* independentes. Elas representam, principalmente, os diferentes padrões visuais necessários para construir uma célula completa.

O ponto importante é que o *sprite* final não precisa existir como uma imagem única.

Ele pode ser **montado dinamicamente**.

---

#### Dividindo um *tile* em partes menores

Para determinar quais partes devem ser utilizadas, cada *tile* é considerado como uma região de **3 × 3 células**.

![Divisão da região](https://github.com/Starciad/PixelDust/assets/69594923/f52ee4f5-683b-4d91-b295-b30198713b96)

O *tile* que estamos renderizando ocupa o centro dessa região. Ao seu redor estão as células que podem influenciar sua aparência.

Em vez de tratar o *tile* como uma única unidade visual, podemos dividi-lo em quatro sub-regiões:

![Divisão do elemento](https://github.com/Starciad/PixelDust/assets/69594923/2740f717-fc26-4ada-af65-55ff96b1e54a)

Cada sub-região corresponde a um dos quatro cantos do *tile*:

- Noroeste;
- Nordeste;
- Sudoeste;
- Sudeste.

Essa divisão é fundamental para o funcionamento do sistema.

Cada uma dessas partes possui uma responsabilidade limitada: determinar como seu próprio canto deve se conectar aos elementos vizinhos.

---

### Determinando os vizinhos relevantes

Uma das características mais interessantes dessa abordagem é que **cada *sub-tile* não precisa consultar toda a vizinhança**.

O *sub-tile* noroeste, por exemplo, está interessado principalmente nos elementos localizados ao norte, oeste e noroeste.

Da mesma maneira:

| *Sub-tile* | Vizinhos relevantes     |
| ---------- | ----------------------- |
| Noroeste   | Norte, Oeste e Noroeste |
| Nordeste   | Norte, Leste e Nordeste |
| Sudoeste   | Sul, Oeste e Sudoeste   |
| Sudeste    | Sul, Leste e Sudeste    |

Essa organização permite transformar um problema aparentemente complexo em quatro pequenas decisões independentes.

> **Nota:** neste artigo, o termo *tile* refere-se às células adjacentes da grade. Já *sub-tile* refere-se a uma das quatro partes internas do *tile* que está sendo construído.

---

### Transformando vizinhos em um identificador

Depois de determinar quais vizinhos devem ser considerados, precisamos transformar essas informações em algo que o algoritmo possa utilizar.

Uma solução simples é atribuir um valor para cada direção.

Por exemplo:

- Norte = 1
- Oeste = 2
- Noroeste = 4

Cada vizinho presente contribui com seu respectivo valor. A soma desses valores gera um identificador único para a configuração analisada.

Podemos representar isso como:

$$
ID = N + O + NO
$$

onde cada componente pode estar presente ou ausente.

Por exemplo, se os três vizinhos estiverem presentes:

$$
ID = 1 + 2 + 4 = 7
$$

Se apenas o norte estiver presente:

$$
ID = 1
$$

Se apenas o oeste estiver presente:

$$
ID = 2
$$

Se nenhum estiver presente:

$$
ID = 0
$$

Na prática, isso é equivalente à utilização de ***bits***.

Cada direção ocupa uma posição diferente dentro de um pequeno conjunto de *bits*, e a combinação deles representa o estado dos vizinhos.

Essa técnica é particularmente útil em sistemas de *tiles* porque permite transformar uma configuração espacial em um número inteiro simples, que posteriormente pode ser utilizado para selecionar um *sprite*.

---

#### Por que utilizar uma soma ponderada?

Poderíamos representar os vizinhos utilizando três valores booleanos:

```text
Norte    = verdadeiro
Oeste    = falso
Noroeste = verdadeiro
```

Porém, isso exigiria uma estrutura adicional para comparar combinações.

Ao utilizar pesos diferentes, podemos transformar diretamente essa combinação em um identificador:

```text
Norte     = 1
Oeste     = 2
Noroeste  = 4
```

Assim:

```text
Norte + Noroeste
= 1 + 4
= 5
```

O número `5` passa a representar aquela configuração específica.

Essa é uma aplicação simples de uma **máscara de *bits***.

O mesmo princípio pode ser utilizado em diversas outras situações de desenvolvimento de jogos, como:

- sistemas de *autotiling*;
- máscaras de colisão;
- estados de vizinhança;
- seleção de animações;
- conectividade entre objetos;
- geração procedural de mapas.

---

### Reduzindo as combinações

Cada *sub-tile* possui três possíveis vizinhos, portanto existem:

$$
2^3 = 8
$$

combinações possíveis.

Entretanto, não precisamos necessariamente de oito *sprites* diferentes.

Algumas combinações produzem o mesmo resultado visual ou podem ser agrupadas de acordo com a forma como o *Blob Tileset* é construído.

Dessa forma, cada *sub-tile* pode ser representado por apenas **seis casos visuais distintos**.

Essa redução é uma das principais razões pelas quais o sistema consegue representar uma quantidade muito grande de configurações com relativamente poucos *sprites*.

---

#### *Sub-tile* noroeste

![Configurações do sub-tile noroeste](https://github.com/Starciad/PixelDust/assets/69594923/d8836c44-fe94-47a3-ae24-61b17a39b698)

O *sub-tile* noroeste analisa os vizinhos ao norte, oeste e noroeste.

Com base na combinação encontrada, ele seleciona a representação correspondente para o canto superior esquerdo do *tile*.

---

#### *Sub-tile* nordeste

![Configurações do sub-tile nordeste](https://github.com/Starciad/PixelDust/assets/69594923/e8b1e98d-9a44-448c-bc17-9b4905638161)

O *sub-tile* nordeste realiza o mesmo procedimento, mas considerando a região superior direita.

Seus vizinhos relevantes são:

- Norte;
- Leste;
- Nordeste.

---

#### *Sub-tile* sudoeste

![Configurações do sub-tile sudoeste](https://github.com/Starciad/PixelDust/assets/69594923/2a58c978-0239-4d4b-a399-ce98b459eba9)

O *sub-tile* sudoeste é responsável pela região inferior esquerda.

Ele considera:

- Sul;
- Oeste;
- Sudoeste.

---

#### *Sub-tile* sudeste

![Configurações do sub-tile sudeste](https://github.com/Starciad/PixelDust/assets/69594923/6534419e-fd77-4799-8b43-f7f4e10358a2)

Finalmente, o *sub-tile* sudeste trata da região inferior direita e verifica:

- Sul;
- Leste;
- Sudeste.

---

### Da vizinhança ao *sprite* final

Podemos resumir todo o processo em algumas etapas:

1. Vizinhança do tile: identificar os vizinhos relevantes.
1. Calcular a máscara de bits.
1. Selecionar o sprite do sub-tile.
1. Repetir para os quatro sub-tiles.
1. Renderizar o tile completo.

O ponto importante é que o algoritmo não precisa descobrir qual é o *sprite* completo.

Ele precisa apenas responder a quatro perguntas menores:

> Como deve ser o canto superior esquerdo?
>
> Como deve ser o canto superior direito?  
>
> Como deve ser o canto inferior esquerdo?  
>
> Como deve ser o canto inferior direito?

A composição dessas quatro respostas produz o resultado final.

---

### Renderização dinâmica

No *Pixel Dust*, esse processo é realizado durante a renderização dos elementos.

Para cada elemento que precisa ser desenhado, o sistema consulta sua vizinhança, determina a configuração de cada *sub-tile* e então utiliza as partes correspondentes para montar sua aparência.

Isso significa que a aparência do elemento não precisa ser armazenada permanentemente.

Ela é uma consequência do estado atual do mapa.

Essa característica é especialmente interessante para jogos em que o cenário pode ser alterado durante a execução.

Imagine, por exemplo, um elemento sendo adicionado no meio de uma área existente.

O sistema não precisa gerar um novo conjunto de *sprites*. Basta atualizar o estado do mapa e, na próxima renderização, a vizinhança será analisada novamente.

O mesmo vale para a remoção de elementos.

---

### Uma propriedade importante: localidade

Uma das vantagens dessa técnica é que a decisão sobre um *tile* depende apenas de uma pequena região ao seu redor.

Não precisamos analisar o mapa inteiro para determinar como uma célula deve ser desenhada.

Em termos conceituais:

$$
A(x,y) = f(N, S, L, O, NO, NE, SO, SE)
$$

onde \(A(x,y)\) representa a aparência do *tile* e os demais termos representam sua vizinhança.

Na implementação baseada em *sub-tiles*, essa função ainda pode ser decomposta:

$$
A = A_{NO} + A_{NE} + A_{SO} + A_{SE}
$$

Cada parcela representa uma pequena decisão independente.

Essa propriedade torna o sistema relativamente barato e previsível, especialmente quando comparado a soluções que precisam analisar grandes regiões do mapa.

---

### O papel do *tile* diagonal

Um detalhe particularmente importante é a consideração dos vizinhos diagonais.

É tentador verificar apenas os quatro vizinhos cardeais:

```text
    N
    │
O ─ X ─ L
    │
    S
```

Porém, isso não é suficiente para construir algumas das transições presentes em um *Blob Tileset*.

Por exemplo, considere:

```text
X X
X .
```

O canto diagonal fornece uma informação que os vizinhos cardeais isoladamente não conseguem representar.

Por isso, cada *sub-tile* considera também o vizinho diagonal correspondente.

Essa pequena informação adicional é o que permite distinguir situações como:

- uma conexão contínua;
- um canto externo;
- um canto interno;
- uma interrupção da superfície.

---

### Por que 47 *sprites* são suficientes?

O número 47 pode parecer arbitrário à primeira vista, mas ele surge justamente da combinação das diferentes configurações necessárias para representar as bordas e os cantos de uma superfície.

A grande sacada do *Blob Tileset* é que não precisamos tratar cada configuração do mapa como um *sprite* independente.

Em vez disso, as partes são reutilizadas.

Um único *sprite* de canto pode aparecer em diversas configurações diferentes. O mesmo acontece com bordas e regiões preenchidas.

Portanto, os 47 *sprites* não representam 47 situações isoladas.

Eles representam **peças reutilizáveis de uma linguagem visual**.

O sistema de renderização é responsável por combiná-las de acordo com o contexto.

Essa distinção é importante porque transforma o *tileset* de uma simples coleção de imagens em uma espécie de sistema de composição.

---

### Generalizando a técnica

Embora o exemplo do *Pixel Dust* tenha sido desenvolvido para elementos de um mapa, a mesma abordagem pode ser aplicada a praticamente qualquer situação em que uma superfície precise se adaptar às suas vizinhas.

Alguns exemplos incluem:

#### Terreno

Gramados, terra, areia, neve e outros terrenos podem utilizar o sistema para criar transições naturais entre diferentes materiais.

#### Água

A borda de rios, lagos e poças pode ser determinada automaticamente de acordo com as células adjacentes.

#### Paredes

Uma parede pode selecionar automaticamente seus cantos, bordas e regiões internas sem exigir que cada configuração seja desenhada manualmente.

#### Plataformas

Em jogos 2D, plataformas podem utilizar máscaras de vizinhança para determinar suas extremidades.

#### Cavernas

Mapas gerados proceduralmente podem se beneficiar bastante desse sistema, pois a geometria do cenário pode ser definida primeiro e a aparência calculada posteriormente.

#### Materiais diferentes

O conceito também pode ser estendido para situações em que duas superfícies diferentes precisam interagir.

Por exemplo:

```text
Grama → Terra
Areia → Água
Neve → Rocha
Lama → Grama
```

Nesse caso, a máscara pode deixar de representar apenas "existe ou não existe um vizinho" e passar a representar **qual material está presente naquela posição**.

---

### *Blob Tileset* não é apenas uma técnica de arte

Uma consequência interessante desse sistema é que ele separa parcialmente duas responsabilidades:

**A lógica do mapa** determina o que existe.

**O sistema de renderização** determina como aquilo deve parecer.

Essa separação é bastante útil.

Podemos armazenar o mapa simplesmente como:

```text
0 0 1 1 1 0
0 1 1 1 0 0
0 1 1 0 0 0
```

onde `1` representa a presença de determinado elemento.

A partir dessa informação, o sistema de renderização identifica quais células possuem vizinhos e seleciona o *sprite* correspondente para cada posição. Assim, ele pode desenhar bordas, cantos e conexões entre as áreas ocupadas sem que a estrutura lógica do mapa precise conhecer os detalhes de cada *sprite*.

Essa separação também facilita a troca do estilo artístico. Podemos substituir os *sprites* do *tileset* sem necessariamente modificar o algoritmo que determina suas conexões.

---

### Aplicação no *Pixel Dust*

A implementação dessa abordagem foi realizada originalmente quando o projeto ainda se chamava ***Pixel Dust***.

O objetivo inicial era relativamente simples: fazer com que elementos colocados próximos uns dos outros deixassem de apresentar fronteiras tão rígidas.

O resultado, entretanto, foi além de uma simples melhoria estética.

O sistema passou a permitir que os elementos se adaptassem automaticamente ao ambiente ao redor, eliminando grande parte da necessidade de tratar manualmente cada configuração possível.

Antes da implementação do algoritmo, a representação visual apresentava transições rígidas entre os elementos:

![Antes da implementação](https://github.com/Starciad/PixelDustSandbox/assets/69594923/33109b4c-8c23-4726-a245-f2dc851be24c)

![Antes da implementação](https://github.com/Starciad/PixelDustSandbox/assets/69594923/ef1787ff-729d-497d-8eb1-edc08a215850)

Depois da implementação, os elementos passaram a se adaptar à sua vizinhança:

![Depois da implementação](https://github.com/Starciad/PixelDustSandbox/assets/69594923/f34dd5f8-ee90-4103-ade0-75ce202f9c8d)

![Depois da implementação](https://github.com/Starciad/PixelDustSandbox/assets/69594923/08915d57-71b2-42f5-b8a8-2ef751c7fb95)

![Depois da implementação](https://github.com/Starciad/PixelDustSandbox/assets/69594923/9785d586-29d5-4da9-8763-0b0b18fe7b31)

A diferença visual é particularmente perceptível em áreas maiores, onde as pequenas transições entre os *tiles* deixam de chamar tanta atenção.

---

### Vantagens da abordagem

A utilização de um *Blob Tileset* traz algumas vantagens bastante claras.

#### Redução da quantidade de *sprites*

Em vez de criar uma imagem para cada configuração possível, um conjunto relativamente pequeno de peças pode ser reutilizado.

#### Composição automática

O desenvolvedor não precisa definir manualmente qual *sprite* deve ser utilizado em cada célula do mapa.

#### Mapas dinâmicos

Como a aparência depende da vizinhança atual, alterações no mapa podem refletir automaticamente na renderização.

#### Compatibilidade com geração procedural

Um algoritmo pode gerar a estrutura do mapa sem precisar conhecer as regras visuais do *tileset*.

#### Separação entre lógica e apresentação

A estrutura lógica do mapa pode permanecer simples enquanto o sistema de renderização cuida da aparência.

#### Melhor integração visual

As bordas e os cantos deixam de formar linhas rígidas e passam a acompanhar a geometria formada pelos elementos.

---

### Considerações de implementação

Apesar de relativamente simples, existem alguns detalhes que merecem atenção ao implementar esse sistema.

#### Atualização de vizinhos

Quando um *tile* é modificado, sua própria aparência pode mudar, mas seus vizinhos também podem precisar ser recalculados.

Por exemplo, se uma célula for removida:

```text
Antes:

XXX
XXX
XXX
```

e a célula central desaparecer:

```text
XXX
X.X
XXX
```

não é apenas a célula removida que mudou visualmente. As células ao seu redor também podem precisar trocar seus *sub-tiles*.

Por isso, em um sistema otimizado, alterações no mapa podem marcar uma pequena região como "suja" para que ela seja recalculada posteriormente.

---

#### Renderizar sob demanda

Nem sempre é necessário recalcular todos os *tiles* a cada quadro.

Se o mapa for estático durante determinado período, podemos calcular a aparência apenas quando sua estrutura for modificada.

Uma estratégia comum é:

1. alterar o mapa;
1. identificar os *tiles* afetados;
1. recalcular suas máscaras;
1. atualizar a informação de renderização;
1. desenhar normalmente até que outra alteração ocorra.

Isso pode reduzir significativamente o trabalho em mapas grandes.

---

### Conclusão

O *Blob Tileset* é um exemplo interessante de como uma pequena quantidade de informação pode produzir uma variedade muito maior de resultados visuais.

A ideia central é simples:

> **Não precisamos armazenar todas as aparências possíveis de um *tile*; precisamos armazenar as peças necessárias para construí-las.**

Ao dividir cada *tile* em quatro sub-regiões, consultar sua vizinhança e utilizar máscaras de *bits* para representar as conexões, podemos determinar automaticamente quais partes devem ser renderizadas.

No caso apresentado aqui, essa abordagem permite reproduzir as conexões necessárias com apenas 47 *sprites*, enquanto mantém o mapa completamente baseado em uma grade tradicional.

Mais importante do que o próprio número de *sprites* é o conceito por trás dele. O sistema demonstra uma estratégia bastante geral de desenvolvimento:

> **Quando existem muitas combinações possíveis, procure decompor o problema em pequenas decisões independentes e reutilizáveis.**

Essa mesma ideia pode ser aplicada a diversos outros sistemas de jogos, especialmente quando precisamos transformar uma estrutura lógica simples em uma representação visual mais rica.

No *Pixel Dust*, essa técnica serviu como uma forma de tornar o mundo mais coeso visualmente. Em outros projetos, ela pode ser utilizada para terrenos, paredes, água, cavernas, plataformas ou praticamente qualquer superfície cuja aparência dependa de suas vizinhas.

---

#### Fontes e referências

- *[Tileset Roundup — Boris](https://www.boristhebrave.com/2013/07/14/tileset-roundup/?q=tutorials/tileset-roundup)*;
- *[Wang "Blob" Tileset — Guy](https://opengameart.org/content/wang-%E2%80%98blob%E2%80%99-tileset)*;
- *[Wang Blob Tilesets](https://www.boristhebrave.com/permanent/24/06/cr31/stagecast/wang/blob.html)*.

##### Leitura adicional

O artigo *[Generating Tilesets](https://www.tilesetter.org/docs/generating_tilesets)*, do *Tilesetter*, apresenta outras aplicações dos *Blob Tilesets* e destaca sua utilidade na geração de padrões variados, incluindo labirintos e outros ambientes para jogos de plataforma, *side-scrolling* e *top-down*.

> A documentação também apresenta diferentes exemplos de *Blob Tilesets* que podem ser utilizados como referência para compreender melhor a técnica.
