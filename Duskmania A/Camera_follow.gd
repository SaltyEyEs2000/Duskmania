extends Camera2D

var camera_speed = 1000
var base_zoom = 1.0  # 基础缩放倍率

var mousePos = Vector2()

func _physics_process(delta):
	var mouse_pos = get_viewport().get_mouse_position()
	var window_size = get_viewport().get_visible_rect().size

	# 在鼠标接触到窗口边缘时，计算出相机的移动速度
	var move_vector = Vector2.ZERO
	if mouse_pos.x <= 0:
		move_vector.x = -1
	elif mouse_pos.x >= window_size.x:
		move_vector.x = 1
	if mouse_pos.y <= 0:
		move_vector.y = -1
	elif mouse_pos.y >= window_size.y:
		move_vector.y = 1
	
	# 根据移动速度和delta来移动相机
	position += move_vector.normalized() * camera_speed * delta / zoom
	

var min_zoom := Vector2(0.4, 0.4)
var max_zoom := Vector2(4, 4)

var target_zoom := zoom  # 新增一个目标缩放值用于插值

func _process(_delta):
	zoom = zoom.lerp(target_zoom, 0.1)  # 使用linear_interpolate函数让当前缩放值逐渐过渡到目标缩放值
	
	if is_middle_mouse_pressed:
		var new_mouse_pos = get_viewport().get_mouse_position()
		var move = prev_mouse_pos - new_mouse_pos
		move_camera_position(move)
		prev_mouse_pos = new_mouse_pos
	

var is_middle_mouse_pressed = false
var prev_mouse_pos = Vector2()

func _input(event):
	if event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_WHEEL_UP:
		target_zoom *= 1.1  # increase target zoom by 10%
		if target_zoom > max_zoom:
			target_zoom = max_zoom  # limit target zoom to max_zoom
	elif event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_WHEEL_DOWN:
		target_zoom /= 1.1  # decrease target zoom by 10%
		if target_zoom < min_zoom:
			target_zoom = min_zoom  # limit target zoom to min_zoom
	
	# 鼠标中键移动画面
	if event is InputEventMouseButton:
		if event.button_index == MOUSE_BUTTON_MIDDLE and event.is_pressed():
			is_middle_mouse_pressed = true
			prev_mouse_pos = get_viewport().get_mouse_position()
		elif event.button_index == MOUSE_BUTTON_MIDDLE and not event.is_pressed():
			is_middle_mouse_pressed = false
	

func move_camera_position(move):
	global_transform.origin += move / zoom
