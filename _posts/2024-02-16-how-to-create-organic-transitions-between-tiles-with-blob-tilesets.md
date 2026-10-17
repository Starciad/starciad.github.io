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

## Introdução

Mapas baseados em grades são amplamente utilizados no desenvolvimento de jogos. Sua estrutura facilita a organização do cenário, a detecção de colisões, a geração procedural de ambientes e a representação de elementos como terrenos, paredes, líquidos e plataformas. Entretanto, embora essa organização seja conveniente para a lógica do jogo, ela pode produzir um resultado visual excessivamente rígido: quando duas superfícies se encontram, suas fronteiras tendem a acompanhar os limites das células, tornando as transições facilmente perceptíveis.

Uma maneira de contornar esse problema consiste em utilizar um *Blob Tileset*, uma técnica de *autotiling* que determina automaticamente a aparência de uma célula com base nos elementos que a cercam. Em vez de exigir que o desenvolvedor selecione manualmente uma imagem para cada situação, o sistema identifica as conexões existentes entre as células e utiliza essa informação para compor a representação visual adequada.

A principal vantagem dessa abordagem está na reutilização de imagens. Embora uma célula possa assumir diferentes aparências conforme sua vizinhança, não é necessário desenhar manualmente uma imagem independente para cada combinação possível. Por meio de regras de conectividade e de um conjunto relativamente pequeno de peças, é possível representar uma grande variedade de configurações. No modelo tradicional de conectividade binária conhecido como *Blob Tileset* de 47 peças, por exemplo, as combinações válidas podem ser representadas por 47 configurações completas de uma célula.

Essa técnica possui aplicações em diferentes ferramentas e ambientes de desenvolvimento. No *Unity*, abordagens semelhantes podem ser construídas com *Rule Tiles*, enquanto o *RPG Maker VX* utiliza um sistema próprio de *autotiles* para representar determinados tipos de terreno. Apesar das diferenças entre essas implementações, o princípio fundamental é semelhante: utilizar as relações entre células vizinhas para determinar automaticamente a representação gráfica.

Durante o desenvolvimento do *Pixel Dust*, projeto que posteriormente passou a se chamar *Stardust Sandbox*, implementei uma variação dessa abordagem diretamente no processo de renderização. A experiência demonstrou como a separação entre a estrutura lógica do mapa e sua representação visual pode melhorar a aparência do cenário sem exigir uma complexidade proporcional no armazenamento dos dados.

Neste artigo, apresentarei os fundamentos dessa técnica, desde a identificação dos vizinhos relevantes até a composição e a renderização das imagens. O objetivo é compreender o funcionamento do sistema e seus princípios matemáticos, permitindo que a abordagem seja implementada independentemente da linguagem de programação ou da ferramenta utilizada.

## O problema das transições entre células

### Representação convencional

Em um mapa baseado em uma grade, cada célula ocupa uma posição definida por coordenadas. A representação mais simples consiste em associar cada posição a uma imagem e desenhá-la independentemente das demais.

Essa estratégia funciona adequadamente quando os elementos não precisam estabelecer continuidade visual entre si. Entretanto, quando duas regiões representam superfícies que devem se conectar, a ausência de tratamento das fronteiras pode produzir transições artificiais.

![Exemplo de elementos sem transições orgânicas][elements_without_blob_01]

![Outro exemplo de elementos sem transições orgânicas][elements_without_blob_02]

Observe que a estrutura lógica do mapa não precisa ser alterada para resolver esse problema. As células podem continuar organizadas em uma grade regular; o que precisa mudar é a maneira como sua aparência é determinada.

### A necessidade de considerar a vizinhança

Imagine um conjunto de células que representam grama, cercado por células que representam terra. Se cada célula for desenhada de maneira independente, as duas superfícies poderão apresentar uma fronteira perfeitamente alinhada à grade.

Entretanto, a aparência desejada depende da posição relativa entre os materiais. Uma célula localizada no interior de uma região deve apresentar uma representação diferente daquela situada em sua borda. Da mesma forma, os cantos externos e internos exigem tratamentos específicos.

O problema, portanto, não consiste simplesmente em escolher uma imagem para cada material. É necessário determinar **como cada célula se relaciona visualmente com as células adjacentes**.

É justamente essa informação que um sistema de *autotiling* utiliza para selecionar as imagens apropriadas.

## O que é um *Blob Tileset*?

Um *Blob Tileset* é um conjunto de imagens organizado para representar as diferentes configurações de conectividade de uma superfície. Seu funcionamento depende de regras que identificam quais células pertencem à mesma região e quais posições exigem a representação de bordas, cantos ou áreas internas.

O termo *tileset* designa o conjunto de imagens utilizadas para compor o mapa. Já o termo *autotiling* descreve o processo de seleção automática dessas imagens de acordo com as condições de vizinhança.

A diferença em relação à abordagem convencional é que a imagem utilizada em uma posição não precisa ser definida manualmente. Ela pode ser determinada a partir do estado atual do mapa.

### Por que não criar uma imagem para cada configuração?

Uma célula de uma grade bidimensional possui oito vizinhos imediatos: quatro nas direções cardeais e quatro nas direções diagonais.

Se cada vizinho puder estar presente ou ausente, teremos:

$$
2^8 = 256
$$

combinações possíveis.

Criar uma imagem independente para cada combinação seria desnecessário em um sistema convencional de conectividade binária. Muitas configurações são equivalentes do ponto de vista visual, enquanto outras podem ser descartadas por regras de conectividade.

No *Blob Tileset* tradicional de 47 peças, as conexões diagonais são condicionadas à presença dos vizinhos cardeais adjacentes. Essa restrição elimina combinações que não precisam de uma representação independente e reduz o conjunto de configurações válidas de 256 para 47.

É importante observar que essa redução depende do modelo de conectividade adotado. Se o sistema precisar representar relações diagonais de maneira independente, outras regras ou um conjunto maior de configurações poderão ser necessários.

![Conjunto de peças utilizado na composição do Blob Tileset][blob_01]

A redução do número de configurações não significa que o sistema tenha perdido a capacidade de representar as situações relevantes. Significa que as regras de conectividade permitem identificar quais combinações precisam de representações distintas e quais podem compartilhar a mesma solução visual.

## Organização visual e composição das peças

A implementação apresentada neste artigo utiliza a decomposição de uma célula em quatro regiões menores. Essa organização permite tratar cada canto de maneira independente, simplificando a seleção das imagens necessárias para construir a representação final.

### Divisão da região de vizinhança

Para determinar a aparência de uma célula, consideramos uma região de vizinhança de 3 × 3 posições. A célula central corresponde ao elemento que será renderizado, enquanto as oito posições ao redor representam os vizinhos que podem influenciar sua aparência.

![Região de vizinhança de 3 × 3 posições][blob_02]

Essa região fornece as informações necessárias para identificar as conexões entre a célula central e seus arredores. Entretanto, não é necessário tratar todas essas posições como uma única unidade durante a composição gráfica.

Podemos dividir a célula central em quatro regiões, cada uma responsável por um dos seus cantos:

![Divisão da célula em quatro regiões][blob_03]

As regiões são identificadas pelas seguintes posições:

- Noroeste: canto superior esquerdo.
- Nordeste: canto superior direito.
- Sudoeste: canto inferior esquerdo.
- Sudeste: canto inferior direito.

Cada região, denominada *sub-tile*, é responsável por determinar como seu próprio canto deve se conectar aos elementos vizinhos.

Essa decomposição permite transformar um problema que envolve oito vizinhos em quatro decisões menores, cada uma baseada em apenas três posições relevantes.

### Categorias de representação

Do ponto de vista visual, as peças utilizadas na composição podem representar diferentes situações, como:

- Regiões internas, nas quais a superfície continua sem interrupções.
- Bordas horizontais, responsáveis pelas transições nas partes superior e inferior.
- Bordas verticais, utilizadas nas laterais.
- Cantos externos, nos quais a superfície termina em uma extremidade.
- Cantos internos ou reentrâncias, nos quais a região conectada apresenta uma interrupção.
- Lacunas, que representam descontinuidades específicas da superfície.

Essas categorias descrevem funções visuais, não necessariamente arquivos de imagem independentes. Dependendo da organização do conjunto gráfico, as peças podem estar armazenadas separadamente ou integradas em uma folha de imagens.

O aspecto essencial é que a representação final pode ser construída pela reutilização de componentes menores, sem exigir uma imagem exclusiva para cada configuração possível do mapa.

## Identificando os vizinhos relevantes

Cada *sub-tile* considera três posições da vizinhança. Essas posições correspondem aos dois vizinhos cardeais adjacentes ao canto e ao vizinho diagonal localizado naquela direção.

| *Sub-tile* | Vizinho cardeal 1 | Vizinho cardeal 2 | Vizinho diagonal |
| ---------- | ----------------- | ----------------- | ---------------- |
| Noroeste   | Norte             | Oeste             | Noroeste         |
| Nordeste   | Norte             | Leste             | Nordeste         |
| Sudoeste   | Sul               | Oeste             | Sudoeste         |
| Sudeste    | Sul               | Leste             | Sudeste          |

A tabela demonstra que cada região possui uma responsabilidade limitada. O *sub-tile* noroeste, por exemplo, não precisa consultar diretamente o vizinho sudeste para determinar sua própria configuração.

Essa independência reduz a complexidade da seleção visual e permite que as quatro regiões sejam calculadas separadamente.

É importante distinguir a vizinhança lógica da representação gráfica: os vizinhos consultados são células da grade, enquanto o *sub-tile* corresponde a uma região interna da célula que está sendo construída.

### A importância dos vizinhos diagonais

Considerar apenas as quatro direções cardeais não é suficiente para representar todos os cantos de uma superfície.

Observe a seguinte configuração:

```text
X X
X .
```

Nesse exemplo, a posição diagonal participa da definição do canto formado pelas células ocupadas. Ignorar essa informação pode produzir uma transição incorreta ou deixar de distinguir situações visualmente diferentes.

Entretanto, no modelo tradicional de 47 peças, a presença de uma célula diagonal não é suficiente para estabelecer uma conexão visual quando os vizinhos cardeais adjacentes estão ausentes.

Em outras palavras, a conexão diagonal é condicionada à conectividade pelas duas direções cardeais correspondentes. Essa regra evita que uma simples proximidade diagonal produza uma continuidade visual indevida.

Essa restrição constitui uma das características fundamentais do modelo de conectividade utilizado pelo *Blob Tileset* de 47 peças.

## Representando a vizinhança por uma máscara de bits

Depois de identificar os vizinhos relevantes, precisamos transformar suas condições de presença ou ausência em uma representação que possa ser utilizada pelo algoritmo.

Uma solução consiste em atribuir um peso diferente a cada posição. Como cada vizinho é tratado como presente ou ausente, podemos representar seu estado por um valor binário e combinar esses valores em um único identificador.

Considere o *sub-tile* noroeste. Podemos atribuir os seguintes pesos:

- Norte: \(1\).
- Oeste: \(2\).
- Noroeste: \(4\).

A configuração é representada pela expressão:

$$
ID = N + O + NO
$$

Nessa expressão, cada variável assume o valor do seu respectivo peso quando o vizinho está presente e zero quando está ausente.

Se os três vizinhos estiverem presentes, teremos:

$$
ID = 1 + 2 + 4 = 7
$$

Se apenas o norte estiver presente:

$$
ID = 1 + 0 + 0 = 1
$$

Se apenas o oeste estiver presente:

$$
ID = 0 + 2 + 0 = 2
$$

Se nenhum dos três vizinhos estiver presente:

$$
ID = 0 + 0 + 0 = 0
$$

Cada combinação produz um identificador distinto, permitindo que o algoritmo associe a configuração observada a uma representação visual previamente definida.

### Por que utilizar potências de dois?

Os pesos \(1\), \(2\) e \(4\) correspondem às potências de dois:

$$
1 = 2^0,\qquad 2 = 2^1,\qquad 4 = 2^2
$$

Essa propriedade garante que cada posição ocupe um bit diferente. A soma dos pesos presentes, portanto, representa de maneira inequívoca cada combinação de três estados binários.

A mesma ideia pode ser expressa por meio de operações binárias, utilizando uma *máscara de bits*. Em vez de manter três valores separados, o sistema armazena um único número inteiro que representa o estado combinado dos vizinhos.

Como existem três posições binárias independentes, o número de combinações possíveis é:

$$
2^3 = 8
$$

Os identificadores resultantes variam de zero a sete.

Essa representação é útil porque permite consultar uma tabela de configurações, selecionar uma imagem e executar outras operações sem precisar comparar repetidamente estruturas de dados mais complexas.

### Valores das posições na máscara

Ao considerar as oito posições da vizinhança, cada direção pode ser associada a uma potência de dois diferente. Esses são os valores comumente utilizados para compor a máscara de bits:

| Posição  | Valor |
| -------- | ----- |
| Norte    |     1 |
| Nordeste |     2 |
| Leste    |     4 |
| Sudeste  |     8 |
| Sul      |    16 |
| Sudoeste |    32 |
| Oeste    |    64 |
| Noroeste |   128 |

## Reduzindo as configurações de cada *sub-tile*

Embora existam oito combinações binárias para três vizinhos, nem todas precisam corresponder a representações visuais independentes.

A redução depende das regras de conectividade adotadas e da maneira como as peças são organizadas no conjunto gráfico.

No modelo em que a diagonal só pode influenciar a aparência quando os dois vizinhos cardeais correspondentes estão presentes, determinadas combinações tornam-se visualmente equivalentes.

Considere o *sub-tile* noroeste, cujos vizinhos relevantes são norte, oeste e noroeste. Se o norte ou o oeste estiver ausente, a presença do vizinho diagonal não deve criar, por si só, uma conexão de canto. Assim, algumas combinações podem ser agrupadas e encaminhadas para a mesma representação visual.

O resultado é um conjunto de seis casos visuais distintos para cada região, desde que sejam utilizadas essas regras específicas.

**A máscara de bits identifica a configuração observada; a regra de conectividade determina qual configuração visual deve ser selecionada.** São operações relacionadas, mas não equivalentes.

Essa distinção é importante para evitar que os oito identificadores possíveis sejam confundidos com oito imagens obrigatoriamente distintas.

### *Sub-tile* noroeste

![Configurações do sub-tile noroeste][blob_04]

O *sub-tile* noroeste considera os vizinhos norte, oeste e noroeste. A combinação encontrada determina se o canto superior esquerdo deve ser representado como uma região contínua, uma borda ou um canto.

### *Sub-tile* nordeste

![Configurações do sub-tile nordeste][blob_05]

O *sub-tile* nordeste executa o mesmo procedimento para o canto superior direito, considerando os vizinhos norte, leste e nordeste.

### *Sub-tile* sudoeste

![Configurações do sub-tile sudoeste][blob_06]

O *sub-tile* sudoeste determina a representação do canto inferior esquerdo a partir dos vizinhos sul, oeste e sudoeste.

### *Sub-tile* sudeste

![Configurações do sub-tile sudeste][blob_07]

Por fim, o *sub-tile* sudeste considera os vizinhos sul, leste e sudeste para definir a aparência do canto inferior direito.

Em conjunto, essas quatro decisões permitem construir a representação visual completa da célula.

## Da máscara à imagem final

Com as regras de vizinhança estabelecidas, o processo de composição pode ser descrito como uma sequência de operações.

1. Identificar a célula que será renderizada e consultar seus vizinhos relevantes.
2. Construir uma máscara de bits para cada uma das quatro regiões.
3. Aplicar as regras de conectividade para determinar o caso visual correspondente.
4. Selecionar as peças gráficas associadas a cada caso.
5. Compor as quatro regiões para obter a aparência completa da célula.
6. Renderizar o resultado na posição correspondente do mapa.

O algoritmo não precisa procurar uma imagem completa para cada situação possível. Ele precisa determinar como cada canto deve ser representado e combinar as respostas obtidas.

Essa é a principal vantagem da decomposição: **a aparência de uma estrutura complexa pode ser construída a partir de decisões locais e reutilizáveis**.

### Composição e reutilização

Uma mesma peça pode ser utilizada em diferentes posições do mapa sempre que as condições de conectividade forem equivalentes. Isso reduz a quantidade de recursos gráficos necessários e evita a duplicação de imagens que representam a mesma função visual.

No modelo tradicional de 47 peças, o conjunto representa as configurações completas válidas de conectividade. Na organização por quatro *sub-tiles*, as regiões internas são selecionadas e combinadas conforme suas máscaras.

Essas duas perspectivas descrevem maneiras relacionadas de organizar o sistema, mas não devem ser confundidas como se o número de peças completas fosse necessariamente igual ao número de peças internas armazenadas.

O total de arquivos gráficos depende da organização adotada para o conjunto de imagens. O princípio comum é a reutilização de representações equivalentes para evitar a criação manual de todas as combinações possíveis.

## Renderização dinâmica

No *Pixel Dust*, a abordagem foi aplicada diretamente ao processo de renderização. Para cada célula que precisava ser desenhada, o sistema consultava a vizinhança, determinava as configurações dos quatro *sub-tiles* e utilizava as peças correspondentes para construir a aparência final.

A representação visual era, portanto, uma consequência do estado atual do mapa, e não necessariamente uma imagem completa armazenada de maneira independente para cada célula.

Essa característica é especialmente útil em ambientes dinâmicos, nos quais elementos podem ser adicionados ou removidos durante a execução.

Imagine uma região de grama que recebe uma nova célula. A inserção altera não apenas o conteúdo daquela posição, mas também a conectividade das células adjacentes. O sistema pode recalcular as configurações afetadas e atualizar a aparência do terreno automaticamente.

O mesmo princípio se aplica à remoção de células, à modificação de materiais e à geração procedural de ambientes.

## Localidade e custo computacional

Uma propriedade importante da técnica é a **localidade das decisões**. A aparência de uma célula depende de uma região limitada ao seu redor, o que permite determinar sua representação sem analisar o mapa inteiro.

Para uma célula localizada na posição \((x,y)\), podemos representar conceitualmente sua aparência como uma função da vizinhança:

$$
A(x,y) = f(N,S,L,O,NO,NE,SO,SE)
$$

Nessa expressão, \(A(x,y)\) representa a aparência da célula; \(N\), \(S\), \(L\) e \(O\) representam os vizinhos cardeais; e \(NO\), \(NE\), \(SO\) e \(SE\) representam os vizinhos diagonais.

Quando a aparência é construída a partir de quatro regiões independentes, podemos expressar essa composição de maneira simplificada:

$$
A(x,y) =
A_{NO} + A_{NE} + A_{SO} + A_{SE}
$$

O símbolo de adição representa aqui a composição das quatro regiões, e não necessariamente uma soma numérica.

Cada região é calculada a partir de três vizinhos relevantes, e o resultado é combinado para produzir a imagem completa.

Essa organização reduz o trabalho necessário para selecionar a representação de cada célula. Entretanto, o custo total ainda depende de fatores como o tamanho do mapa, a frequência das alterações, a estratégia de renderização e a quantidade de células efetivamente processadas.

## Otimização: atualizando apenas as células afetadas

Embora seja possível recalcular as máscaras durante cada operação de renderização, nem sempre essa é a estratégia mais eficiente.

Em mapas que permanecem estáticos durante vários quadros, repetir os mesmos cálculos continuamente pode representar trabalho desnecessário. Uma alternativa consiste em recalcular a representação apenas quando o estado do mapa for alterado.

### Identificação das células afetadas

Quando uma célula é adicionada, removida ou modificada, sua própria aparência pode mudar. Entretanto, como a decisão depende da vizinhança, as células ao redor também podem precisar de atualização.

Considere uma região preenchida:

```text
X X X
X X X
X X X
```

Se a célula central for removida, a configuração passa a ser:

```text
X X X
X . X
X X X
```

A remoção modifica as condições de vizinhança das células adjacentes. Por isso, atualizar apenas a posição removida não é suficiente para garantir que toda a região seja representada corretamente.

Uma estratégia eficiente consiste em marcar as células afetadas como pendentes de atualização, recalcular suas máscaras e atualizar as informações utilizadas pela renderização.

### Processamento sob demanda

O fluxo de atualização pode ser organizado da seguinte maneira:

1. Modificar o estado lógico do mapa.
2. Identificar as células cuja vizinhança foi alterada.
3. Marcar essas células como pendentes de atualização.
4. Recalcular as configurações visuais necessárias.
5. Atualizar a representação gráfica.
6. Reutilizar os resultados até que uma nova alteração ocorra.

Essa estratégia evita recalcular células cuja vizinhança permanece inalterada.

O raio de atualização necessário depende das regras de vizinhança utilizadas. No modelo descrito, como a decisão considera apenas os vizinhos imediatos, uma alteração normalmente afeta a célula modificada e as posições adjacentes que dependem dela.

## O papel dos materiais e da geração procedural

A técnica apresentada pode ser utilizada em diferentes tipos de cenário, desde que exista uma regra capaz de determinar quais células devem ser consideradas conectadas.

### Terrenos

Grama, terra, areia e neve podem utilizar regras de conectividade para definir bordas e transições. O algoritmo determina as configurações a partir do estado do mapa, enquanto o conjunto gráfico fornece as representações visuais correspondentes.

### Água

Lagos, rios e poças podem utilizar o mesmo princípio para definir seus limites. A aparência da água é calculada de acordo com as células ocupadas e com a relação entre a superfície líquida e os materiais adjacentes.

### Paredes e plataformas

Paredes e plataformas podem utilizar regras de conectividade para selecionar automaticamente cantos, extremidades e regiões internas. Isso reduz a necessidade de definir manualmente a imagem de cada posição.

### Cavernas e mapas procedurais

Em mapas gerados proceduralmente, a geometria lógica do ambiente pode ser produzida independentemente de sua representação visual. Depois que as células ocupadas e vazias são determinadas, o sistema de *autotiling* calcula as transições necessárias.

Essa separação é particularmente útil em sistemas que precisam produzir ambientes variados sem exigir a criação manual de cada configuração.

### Transições entre materiais diferentes

O princípio também pode ser estendido para situações nas quais as células possuem mais de dois estados possíveis.

Uma posição pode representar grama, enquanto a vizinha representa terra; outra pode representar areia em contato com água. Nesses casos, a regra de seleção deixa de considerar apenas a presença ou a ausência de um vizinho e passa a avaliar a identidade do material ou a relação entre os materiais.

A máscara binária tradicional continua sendo útil para situações em que basta identificar a conectividade de uma determinada classe de células. Entretanto, transições entre múltiplos materiais podem exigir tabelas de regras adicionais, máscaras específicas ou outros modelos de seleção.

## Separação entre lógica e apresentação

Uma das consequências mais relevantes dessa arquitetura é a separação entre o estado lógico do mapa e sua representação visual.

A lógica do mapa determina quais elementos existem e em quais posições estão localizados. O sistema de renderização utiliza essas informações para decidir como os elementos devem aparecer.

Essa divisão evita que o modelo de dados precise armazenar todas as decisões gráficas necessárias para representar cada configuração.

Também facilita a substituição do conjunto de imagens. Desde que as novas peças respeitem as regras de composição esperadas pelo algoritmo, o estilo artístico pode ser alterado sem exigir uma reformulação completa da estrutura lógica do mapa.

O mesmo princípio permite utilizar uma única representação lógica para diferentes estilos visuais, como terrenos com aparência cartunesca, ambientes com *pixel art* ou superfícies com contornos mais detalhados.

O *Blob Tileset* não é, portanto, apenas um recurso artístico. Ele representa uma estratégia de organização que separa as relações entre os elementos da maneira como essas relações são desenhadas.

## Vantagens e limitações

A abordagem oferece vantagens importantes, mas sua adoção deve considerar as características do projeto e as regras visuais desejadas.

### Vantagens

**Redução da quantidade de imagens.** A reutilização de peças permite representar diversas configurações sem exigir um arquivo gráfico independente para cada situação.

**Seleção automática.** A aparência de cada célula é determinada por regras de conectividade, reduzindo a necessidade de configurar manualmente o mapa.

**Suporte a cenários dinâmicos.** Alterações no mapa podem ser refletidas automaticamente na representação das células afetadas.

**Integração com geração procedural.** A estrutura do ambiente pode ser gerada independentemente da maneira como suas superfícies serão desenhadas.

**Separação de responsabilidades.** A lógica do mapa pode permanecer independente dos detalhes específicos do conjunto gráfico.

**Possibilidade de otimização.** Como as decisões dependem de uma vizinhança limitada, é possível atualizar apenas as células afetadas por alterações no mapa.

### Limitações

**Dependência das regras de conectividade.** O sistema funciona adequadamente quando as relações entre células podem ser expressas pelas regras definidas. Situações visuais mais complexas podem exigir exceções ou mecanismos adicionais.

**Necessidade de um conjunto gráfico coerente.** As peças precisam compartilhar características visuais compatíveis, como escala, contornos, paleta de cores e alinhamento.

**Complexidade na seleção de materiais.** Quando várias classes de terreno interagem, a simples distinção entre presença e ausência pode não ser suficiente.

**Custo de atualização.** Em mapas muito dinâmicos, a recomposição frequente das regiões pode representar trabalho adicional, especialmente se a atualização não for limitada às células afetadas.

**Limites da composição por regiões.** A divisão em quatro partes funciona bem para determinadas superfícies, mas não substitui modelos mais complexos quando a geometria depende de formas arbitrárias, animações específicas ou relações entre múltiplos objetos.

A escolha dessa técnica deve considerar, portanto, não apenas a redução de imagens, mas também a simplicidade das regras necessárias para representar o comportamento visual desejado.

## Aplicação no *Pixel Dust*

A implementação dessa abordagem ocorreu quando o projeto ainda utilizava o nome *Pixel Dust*. O objetivo inicial era reduzir a rigidez visual das fronteiras entre elementos colocados em células adjacentes.

Antes da aplicação do sistema, cada elemento era representado de maneira relativamente independente, o que tornava as transições entre superfícies muito evidentes.

![Exemplo do mapa antes da implementação do sistema][elements_without_blob_01]

![Outro exemplo do mapa antes da implementação do sistema][elements_without_blob_02]

Com a introdução das regras de conectividade, a representação visual passou a considerar as relações entre as células. As bordas e os cantos puderam ser selecionados automaticamente, produzindo transições mais coerentes entre as regiões do cenário.

![Exemplo do mapa após a implementação do sistema][elements_with_blob_01]

![Segundo exemplo do mapa após a implementação do sistema][elements_with_blob_02]

![Terceiro exemplo do mapa após a implementação do sistema][elements_with_blob_03]

A mudança não exigiu abandonar a estrutura baseada em uma grade. Em vez disso, o sistema passou a interpretar a vizinhança para determinar a aparência de cada elemento.

Essa experiência ilustra como uma alteração relativamente localizada na arquitetura de renderização pode melhorar a coesão visual de um cenário sem aumentar proporcionalmente a complexidade dos dados persistidos.

## Conclusão

O *Blob Tileset* demonstra como um conjunto limitado de imagens pode ser utilizado para representar uma quantidade muito maior de configurações visuais. A ideia fundamental consiste em analisar a vizinhança das células, aplicar regras de conectividade e reutilizar peças gráficas para construir a aparência final.

Ao dividir uma célula em quatro regiões, cada uma responsável por um canto, o sistema transforma a seleção visual em decisões menores. As máscaras de bits fornecem uma representação compacta das condições de vizinhança, enquanto as regras de conectividade determinam quais configurações devem compartilhar a mesma representação gráfica.

No modelo tradicional de 47 peças, a restrição das conexões diagonais permite reduzir as 256 combinações binárias possíveis para 47 configurações válidas. Na abordagem baseada em *sub-tiles*, a mesma preocupação com a reutilização aparece na composição de regiões menores, embora a quantidade de peças armazenadas dependa da organização adotada.

Mais importante do que a quantidade exata de imagens é o princípio arquitetural: **quando um grande número de resultados pode ser produzido pela combinação de partes menores, a decomposição do problema tende a favorecer a reutilização, a manutenção e a automatização**.

No *Pixel Dust*, essa técnica foi utilizada para produzir transições mais coerentes entre elementos do cenário. O mesmo raciocínio pode ser aplicado a terrenos, paredes, plataformas, cavernas e outros ambientes cuja representação visual dependa das relações entre células vizinhas.

## Bibliografia

BORIS. *Tileset roundup*. Boris the Brave, 14 jul. 2013. Disponível em: <https://www.boristhebrave.com/2013/07/14/tileset-roundup/?q=tutorials/tileset-roundup>. Acesso em: 12 dez. 2023.

GUY. *Wang “blob” tileset*. OpenGameArt.org, 4 jun. 2014. Disponível em: <https://opengameart.org/content/wang-%E2%80%98blob%E2%80%99-tileset>. Acesso em: 16 dez. 2023.

WALKER, Guy. *Blob Tileset*. In: BORIS the Brave. *Wang Tiles*. [s. d.]. Disponível em: <https://www.boristhebrave.com/permanent/24/06/cr31/stagecast/wang/blob.html>. Acesso em: 18 dez. 2023.

[blob_01]: {{ "/assets/images/blog/2024/02/16/blob_01.webp" | relative_url }}
[blob_02]: {{ "/assets/images/blog/2024/02/16/blob_02.webp" | relative_url }}
[blob_03]: {{ "/assets/images/blog/2024/02/16/blob_03.webp" | relative_url }}
[blob_04]: {{ "/assets/images/blog/2024/02/16/blob_04.webp" | relative_url }}
[blob_05]: {{ "/assets/images/blog/2024/02/16/blob_05.webp" | relative_url }}
[blob_06]: {{ "/assets/images/blog/2024/02/16/blob_06.webp" | relative_url }}
[blob_07]: {{ "/assets/images/blog/2024/02/16/blob_07.webp" | relative_url }}
[elements_with_blob_01]: {{ "/assets/images/blog/2024/02/16/elements_with_blob_01.webp" | relative_url }}
[elements_with_blob_02]: {{ "/assets/images/blog/2024/02/16/elements_with_blob_02.webp" | relative_url }}
[elements_with_blob_03]: {{ "/assets/images/blog/2024/02/16/elements_with_blob_03.webp" | relative_url }}
[elements_without_blob_01]: {{ "/assets/images/blog/2024/02/16/elements_without_blob_01.webp" | relative_url }}
[elements_without_blob_02]: {{ "/assets/images/blog/2024/02/16/elements_without_blob_02.webp" | relative_url }}
