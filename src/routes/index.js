/* ============
 * Routes File
 * ============
 *
 * The routes and redirects are defined in this file.
 */
/**
 * The routes
 *
 * @type {object} The routes
 */

export default [
  {
    path: '/',
    component: require('@/components/Index.vue'),
    children: [
      {
        path: '/',
        name: 'logs.index',
        component: require('@/components/Logs.vue'),
        meta: {
          auth: true,
          // perimeter: AllPerimeters.entriesPerimeter,
          perimeterAction: 'read',
        }
      },
      {
        path: '/about',
        name: 'About.index',
        component: require('@/components/About.vue'),
        meta: {
          auth: true,
          perimeterAction: 'read',
        }
      },
    ]
  }
]
