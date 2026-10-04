---
layout: page
title: Projetos
permalink: /projects/
---

| Título | Descrição | Ações |
| --- | --- | --- |
{%- for project in site.projects %}
| {{ project.title }} | {{ project.short_description }} | [Ver detalhes]({{ project.url | relative_url }}) |
{%- endfor %}
