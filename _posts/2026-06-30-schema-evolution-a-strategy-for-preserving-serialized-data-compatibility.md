---
layout: post
section: blog
label: schema-evolution-a-strategy-for-preserving-serialized-data-compatibility

title: "Evolução de Esquemas: uma estratégia para preservar a compatibilidade de dados serializados"
author: Starciad
category: Engenharia de Software
tags: [evolução de esquemas, serialização, persistência de dados, migração de dados, arquitetura de software, compatibilidade]
date: 2026-06-30
---

## Introdução

O desenvolvimento de sistemas de software é um processo contínuo de transformação. À medida que novas funcionalidades são incorporadas, requisitos são modificados e decisões arquiteturais são revisadas, as estruturas internas responsáveis por representar os dados de uma aplicação também evoluem. Embora essas mudanças sejam naturais no ciclo de vida de um sistema, elas introduzem um problema relevante: **como preservar a compatibilidade dos dados produzidos por versões anteriores da aplicação?**

Esse problema se torna particularmente evidente em sistemas que dependem da persistência de estado, como jogos eletrônicos, editores de documentos, aplicações de modelagem, ferramentas de engenharia e sistemas de automação. Nesses cenários, os dados são frequentemente serializados para armazenamento e posteriormente reconstruídos durante uma operação de leitura. Se a representação esperada pela versão atual do software divergir daquela utilizada quando os dados foram originalmente produzidos, o processo de restauração poderá falhar, descartar informações ou produzir um estado semanticamente inconsistente.

A solução aparentemente mais simples consiste em manter a estrutura atual compatível com todas as representações anteriores. Entretanto, essa estratégia pode impor restrições excessivas à evolução do domínio, especialmente quando alterações envolvem a reorganização de propriedades, a substituição de tipos, a decomposição de estruturas ou a introdução de novos conceitos. Em determinados casos, a compatibilidade não pode ser garantida apenas pela tolerância do mecanismo de serialização a campos ausentes ou desconhecidos.

Uma alternativa consiste em tratar cada alteração estrutural como uma transformação explícita entre versões de um esquema de dados. Em vez de exigir que a representação antiga corresponda diretamente ao modelo atual, o sistema identifica a versão de origem, interpreta os dados segundo o contrato correspondente e executa uma sequência controlada de migrações até alcançar a representação desejada.

Este artigo apresenta os fundamentos dessa abordagem, denominada aqui **evolução de esquemas orientada por migrações**. O objetivo é descrever seus princípios arquiteturais e fornecer elementos conceituais suficientes para que a estratégia possa ser implementada em diferentes linguagens, sistemas de persistência e formatos de serialização, sem dependência de uma biblioteca específica.

## O problema da evolução dos dados persistidos

A serialização consiste, de maneira geral, na transformação de uma representação de dados existente em memória em uma representação adequada para armazenamento, transmissão ou intercâmbio. O processo inverso, denominado desserialização, reconstrói uma estrutura utilizável pela aplicação a partir dos dados previamente serializados.

Essas operações dependem de algum acordo sobre a organização e a interpretação dos dados. Esse acordo pode ser explícito, mediante um esquema formal, ou implícito, por meio das convenções adotadas pelo programa e pela biblioteca de serialização.

Considere uma aplicação que inicialmente armazena o nível de progresso de um usuário e seu nome. Em uma versão posterior, o sistema passa a exigir também um identificador persistente. Em seguida, o progresso deixa de ser representado por um único número e passa a integrar uma estrutura que contém diferentes atributos.

Embora os dados antigos continuem existindo, a representação esperada pelo software já não é necessariamente equivalente à representação originalmente armazenada. Um desserializador estrito pode rejeitar o conteúdo, enquanto um mecanismo mais permissivo pode reconstruir parcialmente o objeto, atribuir valores padrão ou ignorar informações que não reconhece.

O ponto central é que **compatibilidade estrutural e compatibilidade semântica não são equivalentes**. Um documento pode ser estruturalmente válido e, ainda assim, não representar corretamente o significado esperado pela versão atual da aplicação. Da mesma forma, uma leitura tecnicamente bem-sucedida não garante que os valores preservem suas propriedades e relações originais.

A evolução dos dados persistidos exige, portanto, um mecanismo que considere não apenas a capacidade de interpretar bytes, campos ou documentos, mas também as regras necessárias para transformar uma representação histórica em uma representação contemporânea.

## O que é evolução de esquemas?

Um esquema de dados descreve a estrutura, os tipos, as restrições e, conforme o sistema adotado, as relações semânticas que caracterizam determinada representação. Em sistemas tipados, ele pode corresponder a um conjunto de classes, estruturas ou contratos de dados. Em sistemas orientados a documentos, pode ser expresso por regras que definem os campos admitidos e os valores esperados.

A **evolução de esquemas** consiste na modificação desse contrato ao longo do tempo. Cada revisão pode introduzir propriedades, remover campos obsoletos, alterar tipos, reorganizar estruturas ou modificar a interpretação de informações previamente armazenadas.

Para tornar essas mudanças administráveis, cada revisão relevante deve ser identificável de maneira inequívoca. Essa identificação pode ser feita por números sequenciais, identificadores explícitos ou outro mecanismo de versionamento. O requisito essencial é que o sistema consiga determinar qual representação foi utilizada para produzir determinado conjunto de dados.

É importante distinguir a versão do esquema da versão completa da aplicação. Uma atualização do software pode envolver mudanças de interface, correções de desempenho ou alterações internas que não afetam a estrutura persistida. Inversamente, um esquema pode evoluir de maneira independente do número de versão comercial ou operacional do produto. Por essa razão, **a versão persistida deve representar o contrato dos dados, e não ser confundida automaticamente com a versão do executável**.

Essa distinção permite que o mecanismo de persistência evolua de forma controlada, sem acoplar cada alteração interna do software a uma migração desnecessária.

## Inspiração: migrações de bancos de dados

A inspiração arquitetural desta proposta vem das ferramentas de migração utilizadas em sistemas reais de gerenciamento de bancos de dados. Em aplicações que mantêm bancos de dados relacionais, é comum que a estrutura das tabelas, as restrições e os próprios dados precisem evoluir juntamente com o software.

Uma coluna pode ser adicionada, um campo pode ser dividido em vários outros, uma relação pode ser normalizada ou um tipo de dado pode precisar ser substituído. Essas alterações não são resolvidas apenas pela definição do novo esquema: frequentemente, também é necessário transformar os registros existentes para que continuem representando corretamente as informações após a mudança.

Ferramentas de migração tratam essas operações como etapas identificáveis, ordenadas e controladas. Cada migração representa uma transformação específica, e o sistema mantém informações suficientes para determinar quais alterações já foram aplicadas. Essa organização reduz a necessidade de reconstruir manualmente toda a história de transformação dos dados a cada atualização.

O princípio pode ser observado no artigo [Evolutionary Database Design](https://martinfowler.com/articles/evodb.html), de Martin Fowler, que apresenta a evolução de esquemas de bancos de dados por meio de pequenas migrações versionadas e mantidas sob controle de versão.

A proposta discutida neste artigo transpõe essa ideia para outro contexto: em vez de modificar tabelas e registros diretamente, o sistema transforma **representações serializadas de dados entre revisões sucessivas de um contrato**.

A analogia não significa que uma migração de banco de dados e uma migração de esquema serializado sejam operações idênticas. Bancos de dados frequentemente exigem transações, coordenação entre instâncias concorrentes, tratamento de grandes volumes e estratégias de implantação gradual. Arquivos persistidos podem apresentar outros requisitos, como portabilidade, preservação de versões históricas, recuperação após falhas e compatibilidade com diferentes formatos binários ou textuais.

O que se preserva é o princípio arquitetural: mudanças estruturais devem ser representadas por transformações explícitas, identificáveis, ordenadas e verificáveis.

## O princípio da migração incremental

A estratégia proposta organiza a evolução dos dados como uma sequência de transformações entre versões conhecidas. Em vez de tentar converter diretamente qualquer representação histórica para a versão atual por meio de uma única operação genérica, o sistema utiliza migrações menores, cada uma responsável por uma transição específica.

Considere cinco revisões de um mesmo esquema, identificadas como V1, V2, V3, V4 e V5. Se os dados foram produzidos segundo V1 e a aplicação atual espera V5, o mecanismo deverá reconhecer a representação inicial e aplicar, em ordem, as transformações necessárias para alcançar o destino.

A sequência conceitual é a seguinte:

***V1 → V2 → V3 → V4 → V5***

Cada etapa conhece a estrutura de origem e a estrutura de destino da transformação que executa. A migração entre V2 e V3, por exemplo, não precisa conhecer os detalhes da V1 ou da V5; sua responsabilidade limita-se a transformar corretamente os dados da V2 na representação definida pela V3.

Essa divisão reduz o acoplamento entre revisões distantes e permite que as alterações sejam desenvolvidas, documentadas e testadas individualmente. Também evita que a lógica de todas as mudanças históricas seja concentrada em uma única rotina extensa, repleta de condições para distinguir versões antigas.

A propriedade fundamental é a **composição de migrações**: a transformação completa entre duas versões resulta da aplicação ordenada das etapas intermediárias pertinentes. Se cada etapa preservar as invariantes definidas para seu destino, a sequência poderá conduzir os dados históricos até a representação atual.

A estratégia, contudo, não implica que toda versão precise ser migrada imediatamente após a abertura do arquivo, nem que as versões intermediárias devam ser armazenadas permanentemente. A exigência é que as transformações necessárias estejam disponíveis e que o sistema consiga identificar uma trajetória válida entre a origem e o destino.

## Versionamento explícito e identificação da origem

Para iniciar uma migração de maneira confiável, o sistema precisa conhecer a versão do esquema à qual os dados pertencem. Essa informação deve ser recuperável sem que seja necessário interpretar previamente o conteúdo completo segundo um contrato desconhecido.

Uma abordagem comum consiste em incluir um cabeçalho no arquivo persistido, contendo metadados como um identificador de formato, a versão do esquema e, quando pertinente, informações adicionais para identificar o tipo de conteúdo. O cabeçalho pode ser armazenado separadamente do conteúdo principal, desde que exista um mecanismo confiável para associá-los.

Em formatos que já oferecem mecanismos de identificação de versões, esses recursos podem ser aproveitados. Entretanto, não se deve presumir que toda biblioteca de serialização ofereça versionamento semântico suficiente para controlar as migrações da aplicação.

A versão deve ser interpretada como parte do contrato de persistência. Caso o sistema encontre uma versão desconhecida, uma versão superior àquela suportada ou metadados inválidos, deverá adotar uma política explícita de tratamento. Interpretar automaticamente um formato desconhecido como se fosse uma versão conhecida pode produzir corrupção lógica silenciosa.

Também é necessário diferenciar a ausência de metadados de uma versão legítima. Arquivos antigos produzidos antes da introdução do versionamento podem exigir uma regra específica de reconhecimento, desde que existam evidências confiáveis de sua estrutura. Essa compatibilidade legada deve ser tratada como uma decisão consciente, e não como uma inferência arbitrária.

## O contrato de dados e a preservação das representações históricas

Cada revisão do esquema deve possuir um contrato de dados próprio, capaz de representar adequadamente o conteúdo persistido naquela versão. Em uma implementação orientada a tipos, isso pode significar manter definições distintas para as diferentes revisões, mesmo quando suas estruturas forem semelhantes.

A preservação dessas representações históricas é uma decisão arquitetural importante. Se a estrutura original for redefinida para corresponder exclusivamente ao modelo atual, o sistema poderá perder a capacidade de interpretar corretamente os dados antigos. Por outro lado, manter todas as revisões exige organização, documentação e manutenção contínuas.

É útil distinguir três conceitos: **representação persistida**, **modelo de execução** e **contrato de serialização**. A representação persistida corresponde ao conteúdo efetivamente armazenado. O contrato de serialização define como esse conteúdo deve ser interpretado e reconstruído. O modelo de execução corresponde à estrutura que a aplicação utiliza durante seu funcionamento.

Esses conceitos podem compartilhar campos e tipos, mas não precisam ser idênticos. O modelo de execução pode conter propriedades temporárias, referências a recursos, caches e outros elementos que não devem integrar o arquivo persistido. Da mesma forma, uma representação histórica pode conter informações que já não possuem correspondência direta no modelo atual.

Separar essas responsabilidades permite que a aplicação modifique sua organização interna sem exigir que todas as mudanças sejam refletidas diretamente no formato persistido.

## O pipeline de restauração

A arquitetura pode ser compreendida como um pipeline de restauração composto por etapas distintas. Embora os detalhes variem conforme a linguagem e o formato utilizado, a separação conceitual das responsabilidades permanece aplicável.

### Identificação e leitura

Inicialmente, o sistema identifica o formato do arquivo e obtém a versão do esquema de origem. Em seguida, seleciona a representação correspondente e realiza a desserialização de acordo com o contrato histórico.

Essa etapa é fundamental porque uma migração precisa receber dados interpretados corretamente. Se o conteúdo for desserializado diretamente segundo a estrutura atual, propriedades antigas poderão ser ignoradas, tipos incompatíveis poderão causar falhas e informações necessárias para as transformações posteriores poderão ser perdidas.

A leitura deve validar os metadados e a estrutura do conteúdo sempre que o formato permitir. Em arquivos potencialmente corrompidos ou não confiáveis, também convém estabelecer limites de tamanho, profundidade e consumo de recursos.

### Aplicação das migrações

Após a leitura, o sistema determina a trajetória de migração entre a versão de origem e a versão de destino. Para uma sequência linear, essa trajetória corresponde à aplicação ordenada das transformações intermediárias.

Cada migração deve receber uma representação compatível com sua versão de origem e produzir uma representação compatível com a versão de destino. Essa fronteira explícita reduz ambiguidades e torna possível testar cada transição de forma isolada.

As migrações também devem definir como tratar informações ausentes, valores padrão, propriedades obsoletas, conversões de tipos e mudanças de significado. Essas decisões são específicas do domínio: não existe uma regra universal capaz de determinar, com segurança, o valor correto de um campo que deixou de existir ou foi substituído por uma estrutura de natureza diferente.

### Mapeamento para o modelo de execução

Quando a representação atinge a versão de destino, o sistema converte os dados para o modelo utilizado pela aplicação. Essa conversão pode envolver a criação de objetos mutáveis, a reconstrução de relações internas, a associação de referências e a aplicação de valores que pertencem exclusivamente ao ambiente de execução.

A separação entre migração e mapeamento é relevante porque a transformação histórica e a organização atual do domínio são responsabilidades diferentes. A primeira busca converter uma representação persistida em outra; a segunda adapta a representação final às necessidades operacionais do software.

Essa distinção também permite que o modelo de execução seja reorganizado sem obrigar o sistema a alterar retroativamente todas as migrações históricas.

### Serialização posterior

Quando os dados restaurados precisam ser salvos novamente, o sistema pode convertê-los para a representação correspondente ao esquema atual e serializá-los segundo o formato adotado.

Desse modo, um arquivo antigo pode ser atualizado progressivamente durante um ciclo de leitura e gravação. Entretanto, essa atualização deve ser uma decisão explícita. Apenas abrir um arquivo não deveria necessariamente provocar a sobrescrita de seu conteúdo original.

Preservar o arquivo de origem até que a nova representação tenha sido produzida e validada reduz o risco de perda de dados decorrente de falhas durante a migração ou a gravação.

## Migrações como transformações determinísticas

Para que a estratégia seja previsível, cada migração deve produzir resultados coerentes a partir de uma entrada válida. Idealmente, uma mesma entrada, processada sob as mesmas regras e condições, deve gerar a mesma saída.

Essa propriedade é conhecida como **determinismo**. Ela facilita a reprodução de erros, a comparação de resultados e a construção de testes automatizados. Também reduz a possibilidade de que o resultado dependa de fatores externos, como a hora da execução, o estado de serviços remotos ou configurações mutáveis não documentadas.

Nem toda transformação de domínio pode ser reduzida a uma operação puramente determinística sem contexto adicional. Se uma migração depender de uma tabela externa, por exemplo, essa dependência deverá ser versionada, congelada ou incorporada ao conjunto de entradas necessário para reproduzir o resultado.

Outro requisito é a preservação das invariantes. Uma migração pode ser estruturalmente bem-sucedida e ainda produzir dados inválidos para o domínio da aplicação. Alterar uma propriedade numérica para um novo tipo, por exemplo, não garante que os valores estejam dentro do intervalo admitido pela nova representação.

Por esse motivo, a validação deve considerar tanto a estrutura quanto o significado dos dados. Entre as verificações possíveis estão a presença de propriedades obrigatórias, a validade de identificadores, a consistência de relações, a preservação de valores relevantes e o atendimento às restrições do modelo de destino.

A determinística execução das migrações não garante, por si só, a correção do sistema. Ela fornece, contudo, uma base mais sólida para verificar e reproduzir o comportamento esperado.

## Organização do grafo de migrações

Em sua forma mais simples, o mecanismo pode adotar uma sequência linear de versões consecutivas. Cada migração conecta uma versão de origem à versão imediatamente seguinte, formando uma trajetória única entre a representação histórica e a atual.

Esse modelo apresenta vantagens importantes: a ordem de execução é explícita, a trajetória é previsível e as dependências são relativamente fáceis de verificar. Para sistemas em que cada revisão corresponde a uma alteração incremental, uma cadeia linear costuma ser suficiente.

Entretanto, a evolução de esquemas também pode ser representada como um **grafo direcionado de migrações**. Nesse modelo, cada vértice representa uma versão do esquema e cada aresta representa uma transformação possível entre duas versões.

Um grafo permite representar trajetórias alternativas, ramificações históricas e migrações específicas para determinados formatos. Essa flexibilidade, porém, introduz a necessidade de definir como o sistema seleciona a trajetória correta. Se houver mais de um caminho entre a origem e o destino, será necessário estabelecer critérios de seleção e verificar se os caminhos produzem resultados semanticamente equivalentes.

Também é importante identificar ciclos indesejados, migrações ausentes e versões sem acesso ao destino pretendido. A configuração do sistema deve ser validada antes da utilização, e não apenas quando um arquivo específico exige uma transição inexistente.

A escolha entre uma cadeia linear e um grafo mais geral depende da complexidade do domínio. Uma estrutura linear favorece a simplicidade e a previsibilidade; um grafo pode ser apropriado quando existem ramificações reais de formato ou trajetórias de transformação distintas.

## Independência do formato de serialização

Uma propriedade importante da abordagem é que **a estratégia de migração não depende de um formato de serialização específico**. O mecanismo pode ser utilizado com representações binárias, textuais ou outras formas de codificação, desde que exista uma maneira confiável de identificar a versão de origem e interpretar seu conteúdo.

Em formatos binários, como o [MessagePack](https://msgpack.org/), a estrutura dos dados é codificada de maneira compacta e adequada ao intercâmbio entre sistemas. Contudo, mudanças incompatíveis nos contratos ainda precisam ser tratadas conforme as regras do formato e da biblioteca utilizada.

Em formatos textuais, como o [JSON](https://www.json.org/json-en.html), os dados podem ser mais fáceis de inspecionar manualmente. O [JSON Schema](https://json-schema.org/understanding-json-schema/basics) oferece recursos para descrever e validar a estrutura, os tipos e as restrições de documentos JSON, mas a validação de um documento não substitui a lógica necessária para transformá-lo semanticamente entre versões.

O mesmo princípio se aplica a XML, formatos proprietários, registros binários e outros mecanismos de persistência. O componente responsável pela leitura e escrita deve conhecer as particularidades do formato adotado, enquanto a infraestrutura de migração deve concentrar-se na transformação entre contratos de dados.

Essa separação reduz o acoplamento arquitetural. A substituição de uma biblioteca de serialização, por exemplo, não precisa exigir a reescrita de todas as regras de migração, desde que os contratos históricos continuem interpretáveis e a fronteira entre as camadas seja preservada.

## Vantagens da abordagem

A principal vantagem da evolução orientada por migrações é a **compatibilidade explícita com dados históricos**. Em vez de depender exclusivamente da tolerância do desserializador, o sistema estabelece como cada versão anterior deve ser transformada para atender às exigências atuais.

Outra vantagem é a modularidade. Cada migração representa uma alteração delimitada, o que favorece a revisão técnica, a documentação e a criação de testes específicos. Quando uma transformação apresenta defeitos, a investigação pode concentrar-se na transição correspondente, sem exigir que toda a lógica histórica seja analisada simultaneamente.

A estratégia também promove a separação de responsabilidades. O formato de serialização, os contratos persistidos, as regras de migração e o modelo de execução podem ser tratados como componentes distintos. Essa organização facilita a evolução independente de cada camada e reduz o impacto de mudanças locais sobre o restante do sistema.

Há ainda benefícios relacionados à observabilidade e à manutenção. Um histórico explícito de migrações permite identificar as transformações previstas para cada versão, documentar decisões de compatibilidade e reproduzir cenários históricos durante os testes.

Por fim, o mecanismo pode reduzir a necessidade de manter o modelo de execução atual permanentemente compatível com todas as estruturas antigas. As representações históricas continuam reconhecidas, mas sua conversão ocorre em uma fronteira controlada, antes de os dados serem entregues à lógica principal da aplicação.

## Desvantagens e limitações

A primeira desvantagem é o **custo de manutenção das versões históricas**. Cada contrato antigo que precisa continuar sendo interpretado representa uma responsabilidade adicional. Embora nem todas as revisões precisem permanecer como modelos ativos de execução, suas representações e regras de conversão devem continuar disponíveis enquanto houver dados que dependam delas.

O número de migrações também cresce ao longo do tempo. Em uma sequência linear com muitas revisões, a manutenção pode tornar-se trabalhosa, especialmente quando mudanças estruturais importantes exigem transformações complexas ou quando existem versões raramente utilizadas que recebem pouca cobertura de testes.

Outro risco está relacionado à perda semântica. Uma migração não pode recuperar informações que nunca foram armazenadas ou que foram descartadas por uma transformação anterior. Da mesma forma, quando uma propriedade antiga não possui correspondência inequívoca na nova estrutura, a conversão pode exigir uma regra de negócio ou uma decisão explícita sobre a informação que será preservada.

A abordagem também exige disciplina no tratamento de falhas. Uma migração interrompida, uma gravação parcial ou uma transformação incorreta pode comprometer o arquivo se a operação sobrescrever os dados originais. Estratégias de gravação atômica, cópias de segurança e validação antes da substituição são, portanto, componentes relevantes de uma implementação robusta.

Por fim, a migração incremental não elimina todos os problemas de compatibilidade. Um formato de serialização pode deixar de ser suportado, uma versão histórica pode estar corrompida ou uma mudança de domínio pode tornar impossível reconstruir determinado significado. A estratégia organiza o tratamento desses casos, mas não os torna automaticamente solucionáveis.

## Alternativas e abordagens complementares

A evolução orientada por migrações é uma alternativa arquitetural, não uma solução universal. Existem outros mecanismos para lidar com a compatibilidade dos dados, e sua adequação depende dos requisitos do sistema.

### Serialização tolerante a versões

Alguns formatos e bibliotecas permitem que versões diferentes de uma estrutura sejam lidas com certo grau de tolerância. Dependendo das regras adotadas, campos novos podem ser ignorados por leitores antigos, enquanto campos ausentes podem receber valores padrão em leitores mais recentes.

O [guia de serialização do Microsoft Orleans](https://learn.microsoft.com/en-us/dotnet/orleans/host/configuration-guide/serialization), por exemplo, documenta regras de tolerância a versões para tipos serializados, incluindo restrições sobre identificadores e alterações de tipos de campos.

Essa abordagem é particularmente útil quando as alterações são pequenas e compatíveis, como a introdução de campos opcionais. Sua limitação aparece quando a evolução exige transformações semânticas, reorganizações estruturais ou conversões que não podem ser resolvidas apenas pelas regras do serializador.

### Compatibilidade retroativa e prospectiva

A compatibilidade retroativa, também denominada *backward compatibility*, ocorre quando uma versão mais recente consegue consumir dados produzidos por uma versão anterior. A compatibilidade prospectiva, ou *forward compatibility*, refere-se à capacidade de uma versão anterior lidar com dados produzidos por uma versão mais recente, dentro das condições previstas pelo formato e pelo sistema.

Essas propriedades podem ser alcançadas por convenções de versionamento e regras de compatibilidade, sem necessariamente executar migrações explícitas. Protocol Buffers, por exemplo, estabelece diretrizes para a evolução de mensagens e para a preservação de identificadores de campos.

A documentação oficial pode ser consultada no [guia de linguagem do Protocol Buffers](https://protobuf.dev/programming-guides/proto3/). Esse modelo é especialmente relevante quando diferentes versões de componentes precisam trocar mensagens ou quando sistemas independentes evoluem em ritmos distintos.

Entretanto, compatibilidade de leitura não significa que o conteúdo tenha sido convertido para um novo contrato. Um sistema pode continuar lendo dados antigos sem jamais atualizar sua representação persistida. A migração explícita e a tolerância a versões podem, inclusive, ser utilizadas em conjunto.

### Conversão direta entre versões

Outra alternativa consiste em implementar uma transformação específica entre cada versão histórica e a versão atual. Nesse modelo, um arquivo V1 pode ser convertido diretamente para V5, enquanto outro arquivo V2 também possui uma conversão própria para V5.

Essa abordagem pode reduzir o número de etapas executadas durante a restauração, mas tende a aumentar o número de transformações que precisam ser desenvolvidas e testadas. Com várias versões de origem e múltiplos destinos possíveis, as regras podem tornar-se redundantes e difíceis de manter.

Ela pode ser adequada quando existem poucas versões suportadas, quando o acesso a versões intermediárias é inviável ou quando há requisitos rigorosos de desempenho. Em sistemas com evolução frequente, uma cadeia incremental costuma favorecer a reutilização das transformações.

### Migração sob demanda e migração em lote

A migração sob demanda, também chamada *lazy migration*, ocorre quando os dados são transformados durante sua leitura ou utilização. Essa estratégia evita processar imediatamente todos os arquivos históricos, o que pode ser vantajoso quando apenas uma parcela deles será acessada.

A migração em lote, por sua vez, processa antecipadamente um conjunto de arquivos ou registros, convertendo-os para uma representação comum antes de sua utilização normal. Essa alternativa pode simplificar as operações posteriores, mas exige recursos computacionais e um planejamento adequado para grandes volumes.

As duas estratégias são compatíveis com o mecanismo proposto. A diferença está no momento em que as transformações são executadas, e não necessariamente na forma como as migrações são definidas.

### Armazenamento de eventos e reconstrução de estado

Em sistemas que utilizam *event sourcing*, o estado atual pode ser reconstruído a partir de uma sequência de eventos persistidos. Essa abordagem altera o foco da persistência: em vez de armazenar apenas o estado consolidado, o sistema registra acontecimentos relevantes para o domínio.

O *event sourcing* oferece benefícios próprios, como histórico de alterações e possibilidade de reconstrução de estados, mas introduz desafios relacionados à evolução dos eventos, à reprodução do histórico e à manutenção de consumidores antigos. Portanto, não elimina a necessidade de estratégias de compatibilidade.

Trata-se de uma alternativa arquitetural mais ampla, que pode ser apropriada quando o histórico dos acontecimentos possui valor de negócio. Para arquivos de salvamento convencionais ou objetos persistidos isoladamente, pode representar uma complexidade desnecessária.

## Recomendações para uma implementação robusta

Uma implementação baseada nessa estratégia deve começar pela definição de um contrato explícito para cada versão persistida. As regras de versionamento precisam ser estáveis, documentadas e independentes de suposições implícitas sobre a estrutura atual do software.

Cada migração deve possuir uma identificação inequívoca, uma versão de origem, uma versão de destino e uma transformação claramente delimitada. Em uma cadeia linear, a configuração deve assegurar que todas as transições necessárias estejam presentes e ordenadas corretamente. Em um grafo, também deve validar a existência de trajetórias e resolver eventuais ambiguidades.

Os testes devem abranger não apenas cada transformação isolada, mas também o fluxo completo de restauração a partir de arquivos representativos das versões suportadas. Testes de regressão são particularmente importantes: uma alteração em uma migração antiga não deve modificar inadvertidamente o significado dos dados já tratados por ela.

Também convém manter arquivos de referência produzidos por versões anteriores, de modo que a compatibilidade possa ser verificada com dados reais ou representativos. Esses arquivos devem ser protegidos contra alterações acidentais e acompanhados de informações suficientes para identificar a versão que os produziu.

A migração deve ser separada da gravação definitiva sempre que possível. Uma abordagem segura consiste em ler o arquivo original, produzir a representação migrada, validá-la e somente então substituir o conteúdo persistido, preferencialmente por um procedimento que minimize a possibilidade de corrupção em caso de interrupção.

É igualmente importante definir uma política para erros. Dados corrompidos, versões desconhecidas e migrações indisponíveis devem produzir resultados explícitos, sem serem tratados silenciosamente como se correspondessem à versão atual. Quando a preservação do conteúdo original for importante, o sistema deve permitir que a falha de migração não destrua a única cópia dos dados.

Por fim, a decisão de manter ou remover suporte a versões antigas deve fazer parte do planejamento do produto. A descontinuação de um formato precisa considerar a existência de arquivos históricos, os requisitos de compatibilidade e a possibilidade de uma conversão intermediária para um formato mais recente.

## Considerações sobre segurança e integridade

Arquivos persistidos nem sempre devem ser considerados confiáveis. Eles podem estar corrompidos, ter sido modificados externamente ou conter valores construídos para explorar falhas no desserializador ou nas rotinas de migração.

Por esse motivo, a restauração deve validar a integridade estrutural do conteúdo e estabelecer limites razoáveis para o consumo de memória, o tamanho das coleções e a profundidade das estruturas aninhadas. A desserialização de tipos arbitrários e a execução de operações externas não controladas durante uma migração devem ser evitadas.

A validação semântica também precisa ser considerada. Uma migração que introduz um novo identificador, converte unidades de medida ou altera uma representação numérica deve assegurar que o resultado respeite as regras do domínio. Quando não for possível estabelecer uma conversão segura, é preferível rejeitar a transformação e preservar os dados originais a produzir um estado aparentemente válido, mas incorreto.

Em aplicações nas quais os arquivos possuem valor significativo, cópias de segurança, mecanismos de recuperação e gravações resistentes a interrupções são partes importantes da arquitetura de persistência. A evolução de esquemas organiza as transformações, mas a integridade dos dados depende também de como essas operações são executadas e de como suas falhas são tratadas.

## Considerações finais

A evolução de esquemas orientada por migrações constitui uma estratégia para administrar as mudanças estruturais inevitáveis em sistemas que persistem dados ao longo do tempo. Sua principal contribuição está em tornar explícita a transformação entre representações históricas, reduzindo a dependência de compatibilidade implícita e separando os contratos persistidos do modelo utilizado durante a execução.

Inspirada nos mecanismos de migração de bancos de dados, a abordagem organiza as alterações em etapas identificáveis, ordenadas e verificáveis. Ao preservar os contratos históricos e estabelecer trajetórias controladas de transformação, torna-se possível restaurar dados antigos sem exigir que a estrutura atual permaneça diretamente compatível com todas as versões anteriores.

Entretanto, a estratégia exige disciplina arquitetural. O versionamento precisa ser confiável, as migrações devem preservar as invariantes do domínio e os testes precisam cobrir tanto as transições individuais quanto os fluxos completos de restauração. A manutenção das versões históricas, a gestão de falhas e a proteção dos dados originais também representam custos que devem ser considerados desde o início.

A abordagem não substitui todos os mecanismos de compatibilidade, nem garante que qualquer formato histórico possa ser recuperado. Seu valor reside em oferecer um modelo explícito, extensível e independente do formato de serialização para os casos em que transformações controladas são necessárias.

A prova de conceito [SchemaEvolution, disponível no GitHub](https://github.com/Starciad/SchemaEvolution), explora essa organização arquitetural por meio de um pipeline de migração entre versões de componentes persistidos. Embora a demonstração utilize C# e MessagePack, esses elementos constituem escolhas de implementação, não requisitos fundamentais da estratégia.

Em última análise, **dados persistidos devem ser tratados como contratos que possuem uma história de evolução própria**. Ao reconhecer essa história e transformá-la em uma sequência explícita de operações, o sistema ganha maior controle sobre a compatibilidade, a integridade e a longevidade das informações que precisa preservar.

## Bibliografia

SADALAGE, Pramod; FOWLER, Martin. **Evolutionary Database Design**. Martin Fowler, maio 2016. Disponível em: <https://martinfowler.com/articles/evodb.html>. Acesso em: 15 jun. 2026.

GOOGLE. **Protocol Buffers: Language Guide (proto3)**. Protocol Buffers Documentation, 2026. Disponível em: <https://protobuf.dev/programming-guides/proto3/>. Acesso em: 18 jun. 2026.

**The Basics**. In: **Understanding JSON Schema**. JSON Schema, [s. d.]. Disponível em: <https://json-schema.org/understanding-json-schema/basics>. Acesso em: 10 jun. 2026.

MICROSOFT. **Serialization in Orleans**. Microsoft Learn, 23 jan. 2026. Disponível em: <https://learn.microsoft.com/en-us/dotnet/orleans/host/configuration-guide/serialization>. Acesso em: 12 jun. 2026.

**MessagePack: It's like JSON, but fast and small**. MessagePack, 2021. Disponível em: <https://msgpack.org/>. Acesso em: 5 jun. 2026.

FOWLER, Martin. **Event Sourcing**. Martin Fowler, 12 dez. 2005. Disponível em: <https://martinfowler.com/eaaDev/EventSourcing.html>. Acesso em: 8 jun. 2026.

STARCIAD. **SchemaEvolution: A proof-of-concept for versioned component persistence**. GitHub, 2026. Disponível em: <https://github.com/Starciad/SchemaEvolution>. Acesso em: 20 jun. 2026.
