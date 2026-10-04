---
layout: page
title: Blog
permalink: /blog/
---

<table>
    <thead>
        <tr>
            <th>Título</th>
            <th>Tags</th>
            <th>Categoria</th>
            <th>Data</th>
            <th>Ação</th>
        </tr>
    </thead>
    <tbody>
        {% for post in site.posts %}
        <tr>
            <td>{{ post.title }}</td>
            <td>{{ post.tags | join: ", " }}</td>
            <td>{{ post.category }}</td>
            <td>{{ post.date | date: "%d/%m/%Y" }}</td>
            <td><a href="{{ post.url | relative_url }}">Ler mais</a></td>
        </tr>
        {% endfor %}
    </tbody>
</table>