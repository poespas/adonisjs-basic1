'use strict'

//bring in model
const Post = use('App/Models/Post')

//bring in validator
const { validate } = use('Validator')

class PostController {
  async index({ view }) {
    // const posts = [
    //   {title: 'Post One', body: 'Body Post One'},
    //   {title: 'Post Two', body: 'Body Post Two'},
    //   {title: 'Post Three', body: 'Body Post Three'}
    // ]

    const posts = await Post.all()

    return view.render('posts.index', {
      title: 'Latest Posts',
      posts: posts.toJSON()
    })
  }

  async details({ view, params }) {
    const post = await Post.find(params.id)

    return view.render('posts.details', {
      post: post
    })
  }

  async add({view}) {
    return view.render('posts.add')
  }

  async store({request, response, session}) {
    //validate
    const validation = await validate(request.all(), {
      title: 'required|min:3|max:255',
      body: 'required|min:3'
    })

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll()
      return response.redirect('back')
    }


    const post = new Post();

    post.title = request.input('title')
    post.body = request.input('body')

    await post.save()

    session.flash({notification: "Post Added!"})

    return response.redirect('/posts')
  }

  async edit({params, view}) {
    const post = await Post.find(params.id)

    return view.render('posts.edit', {
      post: post
    })
  }

  async update({params, view, request, response, session}) {
    //validate
    const validation = await validate(request.all(), {
      title: 'required|min:3|max:255',
      body: 'required|min:3'
    })

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll()
      return response.redirect('back')
    }

    const post = await Post.find(params.id)

    post.title = request.input('title')
    post.body = request.input('body')

    await post.save()

    session.flash({notification: "Post Updated!"})

    return response.redirect('/posts')
  }

  async destroy({ params, session, response }) {
    const post = await Post.find(params.id)

    await post.delete()

    session.flash({notification: "Post Destroyed!"})

    return response.redirect('/posts')
  }
}

module.exports = PostController
