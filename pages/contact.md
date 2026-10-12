---
layout: page
label: contact
section: contact

title: Contato
permalink: /contact/
---

Nesta seção, reúno alguns dos principais canais pelos quais você pode entrar em contato comigo, acompanhar minhas atividades e conhecer um pouco mais sobre meu trabalho. Fique à vontade para explorar os links abaixo e se conectar comigo por meio das plataformas disponíveis.

{% assign contacts = site.data.contacts | sort: "name" %}

{% for contact in contacts %}

- [{{ contact.name }}]({{ contact.url | relative_url }})

{% endfor %}
