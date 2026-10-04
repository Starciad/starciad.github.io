---
layout: page
title: Contato
permalink: /contact/
---

| Título | Ações |
| --- | --- | --- |
{%- for social in site.data.social %}
| {{ social.name }} | [Ver detalhes]({{ social.url | relative_url }}) |
{%- endfor %}
