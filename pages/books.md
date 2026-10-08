---
layout: page
label: books
section: books

title: Livros
permalink: /books/
---

{% assign books = site.books | sort: "title" %}

{% for book in books %}
- {{ book.author | upcase }}. [*{{ book.title }}*]({{ book.url | relative_url }}). {{ book.year }}.
{% endfor %}
