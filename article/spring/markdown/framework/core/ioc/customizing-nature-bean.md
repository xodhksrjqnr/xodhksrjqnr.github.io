Customizing the Nature of a Bean

The Spring Framework provides a number of interfaces you can use to customize the nature of a bean. This section groups them as follows:

[Lifecycle Callbacks]()

[`ApplicationContextAware` and `BeanNameAware`]()

[Other `Aware` Interfaces]()

[]()Lifecycle Callbacks

To interact with the container’s management of the bean lifecycle, you can implement the Spring `InitializingBean` and `DisposableBean` interfaces. The container calls `afterPropertiesSet()` for the former and `destroy()` for the latter to let the bean perform certain actions upon initialization and destruction of your beans.

The JSR-250 `@PostConstruct` and `@PreDestroy` annotations are generally considered best practice for receiving lifecycle callbacks in a modern Spring application. Using these annotations means that your beans are not coupled to Spring-specific interfaces. For details, see [Using `@PostConstruct` and `@PreDestroy`]().

If you do not want to use the JSR-250 annotations but you still want to remove coupling, consider `init-method` and `destroy-method` bean definition metadata.

Internally, the Spring Framework uses `BeanPostProcessor` implementations to process any callback interfaces it can find and call the appropriate methods. If you need custom features or other lifecycle behavior Spring does not by default offer, you can implement a `BeanPostProcessor` yourself. For more information, see [Container Extension Points]().

In addition to the initialization and destruction callbacks, Spring-managed objects may also implement the `Lifecycle` interface so that those objects can participate in the startup and shutdown process, as driven by the container’s own lifecycle.

The lifecycle callback interfaces are described in this section.

[]()Initialization Callbacks

The `org.springframework.beans.factory.InitializingBean` interface lets a bean perform initialization work after the container has set all necessary properties on the bean. The `InitializingBean` interface specifies a single method:

```
void afterPropertiesSet() throws Exception;
```

We recommend that you do not use the `InitializingBean` interface, because it unnecessarily couples the code to Spring. Alternatively, we suggest using the [`@PostConstruct`]() annotation or specifying a POJO initialization method. In the case of XML-based configuration metadata, you can use the `init-method` attribute to specify the name of the method that has a void no-argument signature. With Java configuration, you can use the `initMethod` attribute of `@Bean`. See [Receiving Lifecycle Callbacks](). Consider the following example:

```
<bean id="exampleInitBean" class="examples.ExampleBean" init-method="init"/>
```

Java

Kotlin

```
public class ExampleBean {

	public void init() {
		// do some initialization work
	}
}
```

```
class ExampleBean {

	fun init() {
		// do some initialization work
	}
}
```

The preceding example has almost exactly the same effect as the following example (which consists of two listings):

```
<bean id="exampleInitBean" class="examples.AnotherExampleBean"/>
```

Java

Kotlin

```
public class AnotherExampleBean implements InitializingBean {

	@Override
	public void afterPropertiesSet() {
		// do some initialization work
	}
}
```

```
class AnotherExampleBean : InitializingBean {

	override fun afterPropertiesSet() {
		// do some initialization work
	}
}
```

However, the first of the two preceding examples does not couple the code to Spring.

[]()Destruction Callbacks

Implementing the `org.springframework.beans.factory.DisposableBean` interface lets a bean get a callback when the container that contains it is destroyed. The `DisposableBean` interface specifies a single method:

```
void destroy() throws Exception;
```

We recommend that you do not use the `DisposableBean` callback interface, because it unnecessarily couples the code to Spring. Alternatively, we suggest using the [`@PreDestroy`]() annotation or specifying a generic method that is supported by bean definitions. With XML-based configuration metadata, you can use the `destroy-method` attribute on the `<bean/>`. With Java configuration, you can use the `destroyMethod` attribute of `@Bean`. See [Receiving Lifecycle Callbacks](). Consider the following definition:

```
<bean id="exampleInitBean" class="examples.ExampleBean" destroy-method="cleanup"/>
```

Java

Kotlin

```
public class ExampleBean {

	public void cleanup() {
		// do some destruction work (like releasing pooled connections)
	}
}
```

```
class ExampleBean {

	fun cleanup() {
		// do some destruction work (like releasing pooled connections)
	}
}
```

The preceding definition has almost exactly the same effect as the following definition:

```
<bean id="exampleInitBean" class="examples.AnotherExampleBean"/>
```

Java

Kotlin

```
public class AnotherExampleBean implements DisposableBean {

	@Override
	public void destroy() {
		// do some destruction work (like releasing pooled connections)
	}
}
```

```
class AnotherExampleBean : DisposableBean {

	override fun destroy() {
		// do some destruction work (like releasing pooled connections)
	}
}
```

However, the first of the two preceding definitions does not couple the code to Spring.

You can assign the `destroy-method` attribute of a `<bean>` element a special `(inferred)` value, which instructs Spring to automatically detect a public `close` or `shutdown` method on the specific bean class. (Any class that implements `java.lang.AutoCloseable` or `java.io.Closeable` would therefore match.) You can also set this special `(inferred)` value on the `default-destroy-method` attribute of a `<beans>` element to apply this behavior to an entire set of beans (see [Default Initialization and Destroy Methods]()). Note that this is the default behavior with Java configuration.

[]()Default Initialization and Destroy Methods

When you write initialization and destroy method callbacks that do not use the Spring-specific `InitializingBean` and `DisposableBean` callback interfaces, you typically write methods with names such as `init()`, `initialize()`, `dispose()`, and so on. Ideally, the names of such lifecycle callback methods are standardized across a project so that all developers use the same method names and ensure consistency.

You can configure the Spring container to “look” for named initialization and destroy callback method names on every bean. This means that you, as an application developer, can write your application classes and use an initialization callback called `init()`, without having to configure an `init-method="init"` attribute with each bean definition. The Spring IoC container calls that method when the bean is created (and in accordance with the standard lifecycle callback contract [described previously]() ). This feature also enforces a consistent naming convention for initialization and destroy method callbacks.

Suppose that your initialization callback methods are named `init()` and your destroy callback methods are named `destroy()`. Your class then resembles the class in the following example:

Java

Kotlin

```
public class DefaultBlogService implements BlogService {

	private BlogDao blogDao;

	public void setBlogDao(BlogDao blogDao) {
		this.blogDao = blogDao;
	}

	// this is (unsurprisingly) the initialization callback method
	public void init() {
		if (this.blogDao == null) {
			throw new IllegalStateException("The [blogDao] property must be set.");
		}
	}
}
```

```
class DefaultBlogService : BlogService {

	private var blogDao: BlogDao? = null

	// this is (unsurprisingly) the initialization callback method
	fun init() {
		if (blogDao == null) {
			throw IllegalStateException("The [blogDao] property must be set.")
		}
	}
}
```

You could then use that class in a bean resembling the following:

```
<beans default-init-method="init">

	<bean id="blogService" class="com.something.DefaultBlogService">
		<property name="blogDao" ref="blogDao" />
	</bean>

</beans>
```

The presence of the `default-init-method` attribute on the top-level `<beans/>` element attribute causes the Spring IoC container to recognize a method called `init` on the bean class as the initialization method callback. When a bean is created and assembled, if the bean class has such a method, it is invoked at the appropriate time.

You can configure destroy method callbacks similarly (in XML, that is) by using the `default-destroy-method` attribute on the top-level `<beans/>` element.

Where existing bean classes already have callback methods that are named at variance with the convention, you can override the default by specifying (in XML, that is) the method name by using the `init-method` and `destroy-method` attributes of the `<bean/>` itself.

The Spring container guarantees that a configured initialization callback is called immediately after a bean is supplied with all dependencies. Thus, the initialization callback is called on the raw bean reference, which means that AOP interceptors and so forth are not yet applied to the bean. A target bean is fully created first and then an AOP proxy (for example) with its interceptor chain is applied. If the target bean and the proxy are defined separately, your code can even interact with the raw target bean, bypassing the proxy. Hence, it would be inconsistent to apply the interceptors to the `init` method, because doing so would couple the lifecycle of the target bean to its proxy or interceptors and leave strange semantics when your code interacts directly with the raw target bean.

[]()Combining Lifecycle Mechanisms

As of Spring 2.5, you have three options for controlling bean lifecycle behavior:

The [`InitializingBean`]() and [`DisposableBean`]() callback interfaces

Custom `init()` and `destroy()` methods

The [`@PostConstruct` and `@PreDestroy` annotations]()

You can combine these mechanisms to control a given bean.

If multiple lifecycle mechanisms are configured for a bean and each mechanism is configured with a different method name, then each configured method is run in the order listed after this note. However, if the same method name is configured — for example, `init()` for an initialization method — for more than one of these lifecycle mechanisms, that method is run once, as explained in the [preceding section]().

Multiple lifecycle mechanisms configured for the same bean, with different initialization methods, are called as follows:

Methods annotated with `@PostConstruct`

`afterPropertiesSet()` as defined by the `InitializingBean` callback interface

A custom configured `init()` method

Destroy methods are called in the same order:

Methods annotated with `@PreDestroy`

`destroy()` as defined by the `DisposableBean` callback interface

A custom configured `destroy()` method

[]()Startup and Shutdown Callbacks

The `Lifecycle` interface defines the essential methods for any object that has its own lifecycle requirements (such as starting and stopping some background process):

```
public interface Lifecycle {

	void start();

	void stop();

	boolean isRunning();
}
```

Any Spring-managed object may implement the `Lifecycle` interface. Then, when the `ApplicationContext` itself receives start and stop signals (for example, for a stop/restart scenario at runtime), it cascades those calls to all `Lifecycle` implementations defined within that context. It does this by delegating to a `LifecycleProcessor`, shown in the following listing:

```
public interface LifecycleProcessor extends Lifecycle {

	void onRefresh();

	void onClose();
}
```

Notice that the `LifecycleProcessor` is itself an extension of the `Lifecycle` interface. It also adds two other methods for reacting to the context being refreshed and closed.

Note that the regular `org.springframework.context.Lifecycle` interface is a plain contract for explicit start and stop notifications and does not imply auto-startup at context refresh time. For fine-grained control over auto-startup of a specific bean (including startup phases), consider implementing `org.springframework.context.SmartLifecycle` instead.

Also, please note that stop notifications are not guaranteed to come before destruction. On regular shutdown, all `Lifecycle` beans first receive a stop notification before the general destruction callbacks are being propagated. However, on hot refresh during a context’s lifetime or on stopped refresh attempts, only destroy methods are called.

The order of startup and shutdown invocations can be important. If a “depends-on” relationship exists between any two objects, the dependent side starts after its dependency, and it stops before its dependency. However, at times, the direct dependencies are unknown. You may only know that objects of a certain type should start prior to objects of another type. In those cases, the `SmartLifecycle` interface defines another option, namely the `getPhase()` method as defined on its super-interface, `Phased`. The following listing shows the definition of the `Phased` interface:

```
public interface Phased {

	int getPhase();
}
```

The following listing shows the definition of the `SmartLifecycle` interface:

```
public interface SmartLifecycle extends Lifecycle, Phased {

	boolean isAutoStartup();

	void stop(Runnable callback);
}
```

When starting, the objects with the lowest phase start first. When stopping, the reverse order is followed. Therefore, an object that implements `SmartLifecycle` and whose `getPhase()` method returns `Integer.MIN_VALUE` would be among the first to start and the last to stop. At the other end of the spectrum, a phase value of `Integer.MAX_VALUE` would indicate that the object should be started last and stopped first (likely because it depends on other processes to be running). When considering the phase value, it is also important to know that the default phase for any “normal” `Lifecycle` object that does not implement `SmartLifecycle` is `0`. Therefore, any negative phase value indicates that an object should start before those standard components (and stop after them). The reverse is true for any positive phase value.

The stop method defined by `SmartLifecycle` accepts a callback. Any implementation must invoke that callback’s `run()` method after that implementation’s shutdown process is complete. That enables asynchronous shutdown where necessary, since the default implementation of the `LifecycleProcessor` interface, `DefaultLifecycleProcessor`, waits up to its timeout value for the group of objects within each phase to invoke that callback. The default per-phase timeout is 30 seconds. You can override the default lifecycle processor instance by defining a bean named `lifecycleProcessor` within the context. If you want only to modify the timeout, defining the following would suffice:

```
<bean id="lifecycleProcessor" class="org.springframework.context.support.DefaultLifecycleProcessor">
	<!-- timeout value in milliseconds -->
	<property name="timeoutPerShutdownPhase" value="10000"/>
</bean>
```

As mentioned earlier, the `LifecycleProcessor` interface defines callback methods for the refreshing and closing of the context as well. The latter drives the shutdown process as if `stop()` had been called explicitly, but it happens when the context is closing. The 'refresh' callback, on the other hand, enables another feature of `SmartLifecycle` beans. When the context is refreshed (after all objects have been instantiated and initialized), that callback is invoked. At that point, the default lifecycle processor checks the boolean value returned by each `SmartLifecycle` object’s `isAutoStartup()` method. If `true`, that object is started at that point rather than waiting for an explicit invocation of the context’s or its own `start()` method (unlike the context refresh, the context start does not happen automatically for a standard context implementation). The `phase` value and any “depends-on” relationships determine the startup order as described earlier.

[]()Shutting Down the Spring IoC Container Gracefully in Non-Web Applications

This section applies only to non-web applications. Spring’s web-based `ApplicationContext` implementations already have code in place to gracefully shut down the Spring IoC container when the relevant web application is shut down.

If you use Spring’s IoC container in a non-web application environment (for example, in a rich client desktop environment), register a shutdown hook with the JVM. Doing so ensures a graceful shutdown and calls the relevant destroy methods on your singleton beans so that all resources are released. You must still configure and implement these destroy callbacks correctly.

To register a shutdown hook, call the `registerShutdownHook()` method that is declared on the `ConfigurableApplicationContext` interface, as the following example shows:

Java

Kotlin

```
<span class="fold-block is-hidden-folded">import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

</span><span class="fold-block">public final class Boot {

	public static void main(final String[] args) throws Exception {
		ConfigurableApplicationContext ctx = new ClassPathXmlApplicationContext("beans.xml");

		// add a shutdown hook for the above context...
		ctx.registerShutdownHook();

		// app runs here...

		// main method exits, hook is called prior to the app shutting down...
	}
}</span>
```

```
<span class="fold-block is-hidden-folded">import org.springframework.context.support.ClassPathXmlApplicationContext

</span><span class="fold-block">fun main() {
	val ctx = ClassPathXmlApplicationContext("beans.xml")

	// add a shutdown hook for the above context...
	ctx.registerShutdownHook()

	// app runs here...

	// main method exits, hook is called prior to the app shutting down...
}</span>
```

[]()`ApplicationContextAware` and `BeanNameAware`

When an `ApplicationContext` creates an object instance that implements the `org.springframework.context.ApplicationContextAware` interface, the instance is provided with a reference to that `ApplicationContext`. The following listing shows the definition of the `ApplicationContextAware` interface:

```
public interface ApplicationContextAware {

	void setApplicationContext(ApplicationContext applicationContext) throws BeansException;
}
```

Thus, beans can programmatically manipulate the `ApplicationContext` that created them, through the `ApplicationContext` interface or by casting the reference to a known subclass of this interface (such as `ConfigurableApplicationContext`, which exposes additional functionality). One use would be the programmatic retrieval of other beans. Sometimes this capability is useful. However, in general, you should avoid it, because it couples the code to Spring and does not follow the Inversion of Control style, where collaborators are provided to beans as properties. Other methods of the `ApplicationContext` provide access to file resources, publishing application events, and accessing a `MessageSource`. These additional features are described in [Additional Capabilities of the `ApplicationContext`]().

Autowiring is another alternative to obtain a reference to the `ApplicationContext`. The traditional `constructor` and `byType` autowiring modes (as described in [Autowiring Collaborators]()) can provide a dependency of type `ApplicationContext` for a constructor argument or a setter method parameter, respectively. For more flexibility, including the ability to autowire fields and multiple parameter methods, use the annotation-based autowiring features. If you do, the `ApplicationContext` is autowired into a field, constructor argument, or method parameter that expects the `ApplicationContext` type if the field, constructor, or method in question carries the `@Autowired` annotation. For more information, see [Using `@Autowired`]().

When an `ApplicationContext` creates a class that implements the `org.springframework.beans.factory.BeanNameAware` interface, the class is provided with a reference to the name defined in its associated object definition. The following listing shows the definition of the BeanNameAware interface:

```
public interface BeanNameAware {

	void setBeanName(String name) throws BeansException;
}
```

The callback is invoked after population of normal bean properties but before an initialization callback such as `InitializingBean.afterPropertiesSet()` or a custom init-method.

[]()Other `Aware` Interfaces

Besides `ApplicationContextAware` and `BeanNameAware` (discussed [earlier]()), Spring offers a wide range of `Aware` callback interfaces that let beans indicate to the container that they require a certain infrastructure dependency. As a general rule, the name indicates the dependency type. The following table summarizes the most important `Aware` interfaces:

Table 1. Aware interfaces

Name

Injected Dependency

Explained in…​

`ApplicationContextAware`

Declaring `ApplicationContext`.

[`ApplicationContextAware` and `BeanNameAware`]()

`ApplicationEventPublisherAware`

Event publisher of the enclosing `ApplicationContext`.

[Additional Capabilities of the `ApplicationContext`]()

`BeanClassLoaderAware`

Class loader used to load the bean classes.

[Instantiating Beans]()

`BeanFactoryAware`

Declaring `BeanFactory`.

[The `BeanFactory` API]()

`BeanNameAware`

Name of the declaring bean.

[`ApplicationContextAware` and `BeanNameAware`]()

`LoadTimeWeaverAware`

Defined weaver for processing class definition at load time.

[Load-time Weaving with AspectJ in the Spring Framework]()

`MessageSourceAware`

Configured strategy for resolving messages (with support for parameterization and internationalization).

[Additional Capabilities of the `ApplicationContext`]()

`NotificationPublisherAware`

Spring JMX notification publisher.

[Notifications]()

`ResourceLoaderAware`

Configured loader for low-level access to resources.

[Resources]()

`ServletConfigAware`

Current `ServletConfig` the container runs in. Valid only in a web-aware Spring `ApplicationContext`.

[Spring MVC]()

`ServletContextAware`

Current `ServletContext` the container runs in. Valid only in a web-aware Spring `ApplicationContext`.

[Spring MVC]()

Note again that using these interfaces ties your code to the Spring API and does not follow the Inversion of Control style. As a result, we recommend them for infrastructure beans that require programmatic access to the container.

[Bean Scopes]() [Bean Definition Inheritance]()
