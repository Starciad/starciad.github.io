# Starciad's Dreamland

A personal website for projects, learning, technology, and the things that make the journey worthwhile.

## Contents

- [Starciad's Dreamland](#starciads-dreamland)
  - [Contents](#contents)
  - [About the website](#about-the-website)
  - [What you can find here](#what-you-can-find-here)
  - [Project structure](#project-structure)
  - [Technology stack](#technology-stack)
  - [Running the website locally](#running-the-website-locally)
    - [Prerequisites](#prerequisites)
  - [Building the site](#building-the-site)
  - [Deployment](#deployment)
  - [Licensing](#licensing)
  - [Contributing](#contributing)

## About the website

Starciad's Dreamland is the personal website of Davi Fernandes, who also goes by the name Starciad. It is a small, deliberately personal space for sharing projects, notes, experiences, interests, and a little of the story behind them.

The website is written mainly in Portuguese and is designed to feel more like an organized personal notebook than a traditional product site. Its content is grouped into straightforward sections so that visitors can browse at their own pace, whether they are looking for a project, a technical subject, a book note, or a new blog post.

## What you can find here

The main sections of the website include:

- **History** — a personal biography and a timeline of important stages.
- **Learning** — academic subjects, courses, and programming competitions.
- **Technologies** — notes about programming languages, tools, frameworks, databases, operating systems, and game engines.
- **Experiences** — professional and personal experiences.
- **Projects** — experiments, games, tools, and other projects.
- **Hobbies** — drawings, animations, songs, and other creative interests.
- **Books** — reading notes and technical book references.
- **Blog** — articles and technical reflections.
- **Resume** and **Contact** — a concise professional profile and external contact links.

The content is intentionally allowed to grow with the author. New entries can be added without changing the site's overall layout or navigation.

## Project structure

This is a Jekyll site built from Markdown, Liquid templates, YAML data, and Sass stylesheets:

```text
.
├── _books/              # Book entries
├── _hobbies/            # Hobby entries
├── _learning/           # Learning entries, grouped by category
├── _posts/              # Blog posts (YYYY-MM-DD-title.md)
├── _projects/            # Project entries
├── _technologies/        # Technology entries, grouped by category
├── _data/                # Navigation, contact, and shared text data
├── _includes/            # Reusable Liquid snippets
├── _layouts/             # Page layouts for each content type
├── _sass/                # Sass partials and design variables
├── assets/               # Source stylesheets and static assets
├── pages/                # Top-level pages such as the home page and resume
├── _config.yml           # Jekyll and collection configuration
├── Gemfile               # Ruby and GitHub Pages dependencies
├── LICENSE               # Code license
└── LICENSE-ASSETS       # Asset license
```

The collections defined in [`_config.yml`](_config.yml) generate their own URLs and use dedicated layouts. Blog posts follow the permalink pattern `/blog/:year/:month/:day/:title/`. The generated `_site/` directory is a local build artifact and is intentionally excluded from version control.

## Technology stack

- [Jekyll](https://jekyllrb.com/) 3.10
- [GitHub Pages](https://pages.github.com/) through the `github-pages` gem
- [Liquid](https://shopify.github.io/liquid/) templates
- [Kramdown](https://kramdown.gettalong.org/) Markdown
- Sass for styling
- MathJax for mathematical notation

The dependency versions are managed through [`Gemfile`](Gemfile) and [`Gemfile.lock`](Gemfile.lock) to keep local builds close to the GitHub Pages environment.

## Running the website locally

### Prerequisites

Install Ruby and Bundler on your system. Ruby 3.0 or a compatible version for the locked dependencies is recommended. Then clone the repository and move into its directory:

```sh
git clone https://github.com/Starciad/starciad.github.io.git
cd starciad.github.io
```

Install the project dependencies with Bundler:

```sh
bundle install
```

Start Jekyll's development server:

```sh
bundle exec jekyll serve --livereload
```

Open <http://localhost:4000> in a browser. The `--livereload` option refreshes the page after supported source files change; it can be omitted if automatic refresh is not needed.

## Building the site

To generate the static website without starting a server, run:

```sh
bundle exec jekyll build
```

Jekyll writes the result to `_site/`. To build with the same environment used for production-only features, such as analytics, use:

```sh
JEKYLL_ENV=production bundle exec jekyll build
```

The generated files can be inspected locally, but `_site/` should not be committed because it is recreated on every build.

## Deployment

This repository is structured for GitHub Pages. When Pages is enabled for the repository, GitHub Pages can build the site from the configured publishing source using the `github-pages` dependency and the settings in [`_config.yml`](_config.yml). The production URL is <https://starciad.github.io/>.

Before publishing a change, it is useful to build the site locally and check the rendered pages, links, collection URLs, and responsive layout. Keep content in the appropriate collection or page directory so Jekyll can apply the intended layout automatically.

## Licensing

This repository uses two separate licenses because source code and creative assets have different intended terms:

- **Code — GNU General Public License v3.0:** the templates, styles, scripts, configuration, and other original code are covered by [`LICENSE`](LICENSE). The GPL-3.0 is a copyleft license: when the license applies, redistribution and modified versions must preserve the license and the applicable notices and source-code obligations.
- **Assets — Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International:** the website's original visual assets are covered by [`LICENSE-ASSETS`](LICENSE-ASSETS). This license permits sharing and adaptation for non-commercial purposes, requires appropriate attribution, and requires adaptations to be shared under the same license.

These licenses do not automatically apply to third-party material that may appear in the repository or be referenced by the website. Check the relevant asset or source attribution before reusing it, and read the complete license texts for the authoritative terms.

## Contributing

This is primarily a personal website, but corrections, suggestions, and technical improvements are welcome. For a change:

1. Create a focused branch.
2. Make the smallest coherent change in the appropriate content, layout, or asset directory.
3. Run `bundle exec jekyll build` locally.
4. Open a pull request describing what changed and how it was checked.

Please preserve the existing writing style, front matter, navigation, and license boundaries when adding content.
