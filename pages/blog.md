---
layout: page
identifier: blog
title: Blog
permalink: /blog/
---

| Título | Tags | Categoria | Data | Ação |
| --- | --- | --- | --- | --- |
{%- for post in site.posts %}
| {{ post.title }} | {{ post.tags | join: ", " }} | {{ post.category }} | {{ post.date | date: "%d/%m/%Y" }} | [Ler mais]({{ post.url | relative_url }}) |
{%- endfor %}