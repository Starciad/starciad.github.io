---
layout: page
title: Livros
permalink: /books/
---

| Título | Autor | Ano | Ações |
| --- | --- | --- | --- |
{%- for book in site.books %}
| {{ book.title }} | {{ book.author }} | {{ book.year }} | [Ver detalhes]({{ book.url | relative_url }}) |
{%- endfor %}
